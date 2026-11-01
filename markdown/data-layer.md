# Data layer

Everything market related lives in `lib/market`. The dashboard never imports a
vendor SDK, and the adapters never import React.

## The contract

```ts
export interface FeedUpdate {
  symbol: string;
  price: number;
  at: number;        // epoch milliseconds
}

export interface FeedHandler {
  onUpdate: (update: FeedUpdate) => void;
  onStatus: (status: FeedStatus, detail?: string) => void;
}

export interface MarketFeed {
  readonly kind: string;
  connect: (handler: FeedHandler) => () => void;   // returns unsubscribe
}
```

`FeedStatus` is `idle | connecting | live | stalled | error`. That is the whole
protocol. A provider that can produce a price for a symbol can drive the app.

## The three adapters

### Mock, `lib/market/mock-feed.ts`

Default in development and in tests. Not `Math.random`: a seeded `mulberry32`
generator plus a mild pull back toward the previous close, so a session looks
alive but stays reproducible.

- `seed` (default 42), `intervalMs` (default 1200), `volatility` (default 0.0009).
- Emits one full tick immediately on connect, then one per interval.
- Prices are rounded to two decimals before they are pushed.
- Status goes `connecting`, then `live` with the detail `mock stream`.

### WebSocket, `lib/market/websocket-feed.ts`

Vendor agnostic streaming adapter.

```ts
createWebSocketFeed({
  url,
  symbols,
  buildSubscribeMessage: (symbols) => ({ type: "subscribe", symbol: symbols[0] }),
  parseMessage: (payload) => FeedUpdate[],
  heartbeatMs: 30000,
  buildHeartbeatMessage: () => ({ type: "ping" }),
});
```

Behaviour: exponential backoff with 20 percent jitter between `reconnectBaseMs`
(default 1000) and `reconnectMaxMs` (default 20000), status `stalled` with the
next delay while waiting, `error` on socket error, and a clean teardown that
clears timers and closes the socket. Non string frames and unparsable JSON are
ignored rather than thrown.

### Polling, `lib/market/polling-feed.ts`

For REST quote endpoints.

```ts
createPollingFeed({
  buildUrl: (symbols) => `https://api.example.com/quote?symbols=${symbols.join(",")}`,
  parseResponse: (payload) => FeedUpdate[],
  intervalMs: 5000,
});
```

Behaviour: emits only when a price actually changes, escalates to `stalled`
after one failure and `error` after four, and stretches the delay up to six
times the base interval while failing. Uses an `AbortController` for teardown.

## Choosing an adapter

`lib/market/create-feed.ts` reads public environment variables at call time.

| Variable | Values | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_MARKET_FEED` | `mock`, `websocket`, `polling` | `mock` |
| `NEXT_PUBLIC_MARKET_WS_URL` | `wss://...` | none |
| `NEXT_PUBLIC_MARKET_POLL_URL` | `https://...` | none |
| `NEXT_PUBLIC_MARKET_POLL_MS` | milliseconds, minimum 1000 | 5000 |

A live mode without its URL falls back to the mock adapter. That is deliberate:
an unconfigured build shows a working interface with a clear simulated label
instead of an empty screen.

## Provider examples

The comments at the top of the adapter files contain ready to adapt parsers.

Finnhub streams trades over a socket and wants the token in the query string:

```ts
createWebSocketFeed({
  url: `wss://ws.finnhub.io?token=${process.env.NEXT_PUBLIC_FINNHUB_KEY}`,
  symbols: ALL_SYMBOLS,
  buildSubscribeMessage: (symbols) => ({ type: "subscribe", symbol: symbols[0] }),
  parseMessage: (payload) => {
    const message = payload as { type?: string; data?: { s: string; p: number; t: number }[] };
    if (message.type !== "trade" || !message.data) return [];
    return message.data.map((trade) => ({ symbol: trade.s, price: trade.p, at: trade.t }));
  },
});
```

Twelve Data is a plain REST quote, so polling fits better:

```ts
createPollingFeed({
  buildUrl: (symbols) =>
    `https://api.twelvedata.com/quote?symbol=${symbols[0]}&apikey=${process.env.NEXT_PUBLIC_TWELVE_DATA_KEY}`,
  parseResponse: (payload) => {
    const quote = payload as { symbol?: string; close?: string; timestamp?: string };
    if (!quote.symbol || !quote.close) return [];
    return [{ symbol: quote.symbol, price: Number(quote.close), at: Number(quote.timestamp ?? Date.now()) * 1000 }];
  },
});
```

Provider payload shapes change and differ between tiers. Treat those parsers as
starting points and check them against the current provider documentation.

## Security before real keys

`NEXT_PUBLIC_` values are inlined into the JavaScript bundle at build time. In a
desktop app that bundle ships inside the executable, so any key used by a
browser side feed is readable by anyone with the installer.

The supported path for a real key:

1. Keep it out of `NEXT_PUBLIC_` entirely.
2. Move the HTTP or socket call into a Rust command in `src-tauri/src/lib.rs`.
3. Store the key in the OS credential store or a config file outside the bundle.
4. Stream parsed updates to the frontend over a Tauri channel.
5. Grant the minimum permission in `src-tauri/capabilities/default.json`.

The frontend feed interface does not change in that design. A Tauri command
adapter would implement `MarketFeed` exactly like the other three.

## Quote derivation

`useMarketFeed` turns raw prints into what the UI renders:

```
price        = last print, else previousClose
change       = price - previousClose
changePercent= change / previousClose * 100
history      = last 60 prints, oldest first
updatedAt    = timestamp of the last print for the symbol
```

The previous close comes from the universe fixture. With a real provider, supply
it from the provider's session data instead, either by extending `MarketSymbol`
or by having the adapter push a richer payload.

## Adding a provider checklist

1. Write `parseMessage` or `parseResponse` against real sample payloads.
2. Confirm the symbol format matches the universe (`^GSPC` style for indices may
   need translation to the provider's convention).
3. Decide where the key lives. Client side is acceptable only for a free,
   revocable, public token.
4. Add a unit test for the parser with a captured payload.
5. Set the environment variables and run `npm run build`, then the desktop
   build, because the CSP in `tauri.conf.json` controls which hosts are allowed.
6. Update the footer copy so it stops claiming the data is simulated.

## CSP note

`src-tauri/tauri.conf.json` currently allows `connect-src` to `https:` and
`wss:` so any provider works without a config change. Tighten it to the exact
provider hosts once one is chosen. A strict CSP is the cheapest protection
against a compromised dependency exfiltrating data.
