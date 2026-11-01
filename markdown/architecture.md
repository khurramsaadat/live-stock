# Architecture

## Shape of the system

There are only two processes in production, and one of them is the operating
system's web view.

```
┌─────────────────────────────────────────────────────────────┐
│ Tauri binary (Rust)                                          │
│                                                              │
│  ┌───────────────────────┐      ┌────────────────────────┐  │
│  │ WebView2 (Chromium)   │      │ Rust core              │  │
│  │                       │      │                        │  │
│  │ static export from    │◄────►│ window lifecycle       │  │
│  │ out/ served over the  │ IPC  │ logging plugin         │  │
│  │ asset protocol        │      │ (updater arrives later) │  │
│  │                       │      │                        │  │
│  │ React app             │      │                        │  │
│  └───────────────────────┘      └────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

In development the web view is pointed at the Next dev server instead of the
bundled export, which is the only difference between `npm run dev` and
`npm run desktop:dev`.

There is no application server. Every route is prerendered to HTML at build
time and every interactive surface is a client component. That is a hard
constraint of the desktop build, not a preference: Tauri serves files, it does
not run Node.

## Render model

| Layer | Where | Notes |
| --- | --- | --- |
| Root layout | `app/layout.tsx` | Loads the three fonts, declares the daylight viewport, mounts no providers |
| Page | `app/page.tsx` | One line, renders `Dashboard` |
| Dashboard | `components/market/dashboard.tsx` | Client component, owns the composition and the watchlist hook |
| Leaf components | `components/market/*` | Presentational, receive quotes as props |

`app/layout.tsx` is a server component during the build. `Dashboard` and
everything below it that needs state carries `"use client"`.

## Data flow

```
universe.ts            INDICES + WATCHLIST_UNIVERSE (mock baselines)
     │
     ▼
useWatchlist()         localStorage store, shared across consumers
     │  symbols[]
     ▼
Dashboard              tracked = INDICES + watchlist symbols
     │
     ▼
useMarketFeed()        builds one adapter, connects it, folds updates
     │
     ├── createMarketFeed()  reads NEXT_PUBLIC_MARKET_FEED
     │        ├── createMockFeed()       deterministic random walk
     │        ├── createWebSocketFeed()  backoff, heartbeat, subscribe frame
     │        └── createPollingFeed()    interval poll with escalation
     │
     ▼
FeedUpdate { symbol, price, at }   pushed on every tick
     │
     ▼
FeedState { prices, history, updatedAt }   one object per update
     │
     ▼
Quote[]                derived: change, percent, history, updatedAt
     │
     ▼
IndexCard, WatchlistTable, PulseRail
```

### Why quote fields are derived, not stored

The feed only promises a price per symbol. Change and percent are computed
against `previousClose` from the universe, so a provider that sends nothing but
prints still produces a complete row. History is a rolling window capped at
`HISTORY_LENGTH = 60` prints, which feeds both sparklines and the day range.

### Sequence of a mount

1. `useWatchlist` reads its snapshot. The server and first client render use
   `DEFAULT_WATCHLIST`, then `useSyncExternalStore` swaps in the stored list.
2. `Dashboard` maps the symbols to universe entries.
3. `useMarketFeed` builds the adapter during render (pure construction), then
   connects it in an effect and returns an unsubscribe function.
4. The mock adapter emits `connecting`, then a first full tick, then `live`.
5. Each tick calls `setState` with a new `FeedState`. React batches the updates
   from one interval callback into a single render.
6. Components re-render with new prices. The price cell remounts through a
   `key={price}`, which restarts the tick tint animation.

## State ownership

| State | Owner | Lifetime | Persistence |
| --- | --- | --- | --- |
| Watchlist symbols | `useWatchlist` external store | App | localStorage key `live-stocks.watchlist.v1` |
| Feed connection | `useMarketFeed` effect | Mount of Dashboard | None |
| Prices, history, last update | `useMarketFeed` local state | Mount of Dashboard | None |
| Sort column and direction | `WatchlistTable` local state | Mount of the table | None |
| Search query and keyboard cursor | `AddSymbol` local state | Mount | None |
| Current time | `useNow` external store | App | None |

No global state library. The two stores that need to be shared (watchlist and
time) use `useSyncExternalStore`, which also makes them safe for the static
export: the server snapshot is constant and the client snapshot takes over after
hydration.

## Module boundaries

- `lib/market/types.ts` is the contract. Components only see `Quote`, adapters
  only see `MarketSymbol` and `FeedUpdate`.
- `lib/market/universe.ts` is data, not logic. Adding a symbol is a one line
  change there and nothing else.
- Adapters know nothing about React. Hooks know nothing about vendor payloads.
- Components know nothing about feeds. They render quotes.

Breaking those rules is how this codebase would become hard to change.

## Extension points

| Goal | Touch |
| --- | --- |
| Add a tradable symbol | `WATCHLIST_UNIVERSE` in `lib/market/universe.ts` |
| Add an index | `INDICES` in the same file |
| Connect a provider | `lib/market/create-feed.ts`, supply a parser |
| Add a column | `watchlist-table.tsx` and the `Quote` type if the field is new |
| Add a page | A folder under `app/`, remembering that it must prerender |
| Add a native capability | A Rust command in `src-tauri/src/lib.rs` plus a permission in `capabilities/default.json` |

## Known limits

- Exchange holidays are not modelled. `getSessionInfo` treats a holiday as a
  normal weekday session.
- Prices are not persisted. A restart begins from the universe baselines.
- One feed instance exists per dashboard mount. There is no multiplexing across
  windows.
- The app does not read the system theme. Daylight is intentional.
- No route beyond `/`. This is a single surface by design.
