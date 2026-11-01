# Live Stocks

A cross platform live market desk. Next.js renders the interface, Tauri v2 wraps
it as a native Windows desktop application, and the same codebase runs as a web
app.

## Stack

| Layer | Choice | Version |
| --- | --- | --- |
| Framework | Next.js App Router, static export | 16.4.3 |
| UI | React | 19.3.0 |
| Language | TypeScript | 6.0.3 |
| Styling | Tailwind CSS | 4.x |
| Desktop shell | Tauri CLI / crate | 2.12.4 / 2.12.5 |
| Fonts | Instrument Sans, Instrument Serif, IBM Plex Mono | self hosted via `next/font` |

TypeScript is pinned to 6.0.3 on purpose. TypeScript 7.0 is published, but
`typescript-eslint`, which ships inside `eslint-config-next`, refuses to load
against it and `npm run lint` fails. Move to 7 once the lint stack declares
support.

## Prerequisites on Windows

1. Node 22.19 or newer (`node -v`)
2. Rust stable, 1.90 or newer (`rustc -V`)
3. Microsoft Visual Studio C++ Build Tools
4. Microsoft Edge WebView2 runtime (preinstalled on Windows 11)

## Commands (PowerShell)

Install dependencies once:

```powershell
npm install
```

Run the web app in development:

```powershell
npm run dev
```

The canvas is served at `http://localhost:3000`. Tauri loads this exact URL in
development, so the port is fixed in `npm run dev` and in `src-tauri/tauri.conf.json`.

Type check the project. Run both lines in order, the first regenerates the
Next.js route types:

```powershell
npm run typegen
npm run typecheck
```

Lint and produce the static export:

```powershell
npm run lint
npm run build
```

The export lands in `out\` and that folder is what Tauri bundles.

Run the native desktop window against the dev server:

```powershell
npm run desktop:dev
```

Build the Windows installer. Output goes to
`src-tauri\target\release\bundle\nsis\`:

```powershell
npm run desktop:build
```

## Project shape

```
app/                  Next.js App Router entry, global design tokens
components/market/    dashboard, index cards, watchlist, status
lib/market/           feed adapters, hooks, formatting, symbol universe
src-tauri/            Rust shell, window config, capabilities, icons
  tauri.conf.json     identifier, window defaults, CSP, bundle targets
markdown/             architecture, design system, data layer, testing, decisions
next.config.ts        static export, fixed dev origin, Tailwind loader
```

Start with [markdown/README.md](markdown/README.md) for the full documentation
set, and [markdown/live-data-setup.md](markdown/live-data-setup.md) when you are
ready to connect a real market data provider.

## Market data

The dashboard never imports a vendor SDK. It talks to a `MarketFeed`, which is
three implementations behind one interface:

| Adapter | File | Used for |
| --- | --- | --- |
| Mock | `lib/market/mock-feed.ts` | default, deterministic random walk |
| WebSocket | `lib/market/websocket-feed.ts` | streaming providers, with backoff and heartbeat |
| Polling | `lib/market/polling-feed.ts` | REST quote endpoints |

Selection happens through public environment variables:

```powershell
$env:NEXT_PUBLIC_MARKET_FEED = "websocket"
$env:NEXT_PUBLIC_MARKET_WS_URL = "wss://your-provider/stream"
```

Each adapter takes a parser, so a new provider means writing one function, not
changing the dashboard. Documented Finnhub and Twelve Data shapes live in the
comments at the top of the adapter files. A live mode without a URL falls back
to the mock feed instead of blanking the interface.

One security note before real keys go in. Public environment variables are
inlined into the static bundle, so any token a browser side feed uses is
readable in the installed desktop app. For a production provider key, proxy the
requests through a Tauri command and keep the key in the Rust side or in the OS
credential store.

## Competitive parity

Five market sites were reviewed in November 2026: Yahoo Finance, MarketWatch,
Google Finance, Bloomberg Markets and TradingView. The full findings, the
feature matrix and the reasons for what was skipped live in
[markdown/competitive-analysis.md](markdown/competitive-analysis.md).

Adopted from that review:

- Four indices in one band, split by hairlines (S&P 500, Nasdaq Composite, Dow
  Jones Industrial Average, Russell 2000).
- Symbol search with symbol and company name matching, arrow keys and Enter,
  replacing the old select box.
- Click to sort any numeric column, with a real `aria-sort` state.
- Day range per index with a marker showing where the last print sits.
- Leaders and laggards in the pulse rail.
- An explicit US session badge (pre-market, open, after hours, closed) driven by
  exchange local time in `lib/market/session.ts`.
- A provenance line stating the data is simulated and not investment advice.

The default watchlist covers Nvidia, Microsoft, Apple, Amazon, Alphabet, Meta,
Netflix, AMD, Intel, Oracle and IBM. Tesla, JPMorgan and Exxon Mobil are in the
universe and can be searched in.

Not adopted, with reasons recorded in the analysis: drag to reorder, multiple
watchlists, column customization, volume and fundamentals, extended hours data,
news and alerts, accounts, and sector heatmaps.

## Tests

```powershell
npm run test
npm run typecheck
npm run lint
```

Build the desktop binary and drive it with WebdriverIO:

```powershell
npm run e2e:build
npm run test:e2e
```

The Vitest suite covers the feed adapters, session clock, formatting, watchlist
store and every market component. The E2E suite launches the compiled
executable through tauri-driver and a matching Edge driver. Details, results and
troubleshooting live in [markdown/testing.md](markdown/testing.md).

The auto updater and the GitHub Actions release pipeline arrive in Milestone 5.
No signing key exists yet.

## Design language

The interface is a quiet broadsheet ledger, not a card dashboard. Structure
comes from hairlines and type scale rather than boxes: a serif masthead, an
oversized index hero divided by rules, and a ruled watchlist with inline
sparklines. Amber marks system state and focus, emerald and rust carry
direction, and nothing else competes for attention.

- Daylight theme only. No dark variant, no `prefers-color-scheme` branch.
- Warm neutral surfaces with amber and emerald accents. Blue, indigo and violet
  are off limits.
- No gradients, no default radius, no stock shadow.
- 4px transparent scrollbars are defined globally in `app/globals.css`.
- Copy uses plain sentences with no em dashes.
- Motion is limited to three moments: a staggered page reveal, a sparkline that
  draws once, and a short tint when a price ticks. All three stop under
  `prefers-reduced-motion`.

## Roadmap

1. Milestone 1: workspace, typography, desktop shell, blank canvas.
2. Milestone 2: unstyled skeleton and mocked live market data flow. Done.
3. Milestone 3: bespoke dashboard design under the UI rules. Done.
3a. Competitive parity pass against five market sites. Done, see
    `markdown/competitive-analysis.md`.
4. Milestone 4: Vitest suites and WebdriverIO Tauri end to end tests.
5. Milestone 5: updater signing, `latest.json`, GitHub Actions release pipeline.
