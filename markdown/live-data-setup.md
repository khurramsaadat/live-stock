# Switching from mock data to a real provider

The app already speaks to any provider through one interface. What is missing is
not code structure, it is a provider, a credential and a few product decisions.
This file lists what I need from you and what happens once I have it.

## Part 1: information I need from you

### 1. Provider and plan

Name the provider and the plan you are paying for, plus the documentation URL
you want me to follow. Common choices are Finnhub, Twelve Data, Polygon.io and
Alpha Vantage, and they differ a lot in what their free tiers allow. I am not
picking one for you, because price, coverage and licensing decide it.

Please include:

- Provider name and plan tier.
- Documentation link for the endpoint or socket you want used.
- Whether the plan is personal use or something you intend to distribute.

### 2. Coverage and symbols

- Confirm the exact list you need beyond what is in `lib/market/universe.ts`.
- Say whether indices are included in your plan. Many providers license index
  data separately from equities, and `^GSPC` style symbols often need a
  provider specific translation such as `SPX` or `^SPX`.
- Say whether you need ETFs, futures or crypto later.

### 3. Data quality

This is the decision that changes the architecture most:

- **Real time**: needs exchange entitlements, usually paid, and the provider
  must allow your use case.
- **Delayed**: 15 or 20 minutes is normal on free tiers. The interface already
  has a place to say so, in the footer and the stream block.
- **Extended hours**: pre-market and after hours prices are a separate data
  product on several providers.

### 4. Transport and cadence

- WebSocket stream, HTTP polling, or both.
- Expected update cadence, for example every trade versus every 5 seconds.
- Connection limits: sockets per account, symbols per socket, requests per
  minute.

### 5. Credentials and key handling

Pick one and tell me which:

| Option | Security | Works for |
| --- | --- | --- |
| Key in the Rust side, stored in the OS credential store, requests proxied through a Tauri command | Best. The key never enters the web view | Desktop only |
| Key in a local `.env` file as a non public variable, read by a Rust command | Good enough for a personal build | Desktop, and a small backend later |
| Key in `NEXT_PUBLIC_...` | Weak. The key ships inside the executable and is readable | Only a free, revocable demo token |

Never paste the key into this chat. Put it in a file yourself and tell me the
path, or set it in the environment. I will wire the read path without printing
it.

### 6. Sample payloads

The single most useful thing you can give me: one captured response with the
key redacted.

- One WebSocket message, exactly as it arrives.
- One REST quote response.
- One response that includes previous close or session data, if the provider
  has it.

Parsers written against real payloads are correct on the first try. Parsers
written against documentation examples usually are not.

### 7. Browser origin and CORS

Tauri serves the web view from a custom origin. Many providers block unknown
origins or require a server side key. If the provider does not allow the web
view to call it directly, we proxy through Rust, which is also the better place
for the key. Meaning: tell me whether your plan allows browser or desktop
clients, and I will confirm against their docs.

### 8. Behaviour when the provider fails

Choose the desired behaviour when a socket drops or a poll fails:

- Keep the last price and show a stale badge.
- Show the last price with the stream state Reconnecting, which is what the app
  does now.
- Blank the prices and show an error state.

## Part 2: what I do once I have that

1. **Symbol mapping.** Add a `providerSymbol` field or a mapping table so the
   ledger keeps `AAPL` while the provider gets its own convention. Indices get
   their own mapping.
2. **Parser with fixtures.** Write `parseMessage` or `parseResponse` against
   your captured payload, and add a unit test that replays the fixture. This is
   the part that must never regress.
3. **Key handling.** If you chose the Rust proxy, add a command in
   `src-tauri/src/lib.rs`, a permission in `capabilities/default.json`, store
   the key with the OS credential store, and stream parsed updates to the
   frontend. If you chose `.env`, read it in Rust and keep it off the bundle.
4. **Adapter wiring.** Update `create-feed.ts` and the environment variables so
   the mode is `websocket` or `polling`. Keep the mock as the fallback so the
   interface never goes blank.
5. **CSP.** Tighten `connect-src` in `tauri.conf.json` to the exact provider
   hosts. Today it allows any `https:` and `wss:` host.
6. **Labels and attribution.** Replace the simulated data footer with the
   provider name, the delay if any, and the required attribution text.
7. **Session data.** If the provider supplies previous close and session state,
   move those out of the universe fixture and into the feed payload. The
   session badge should then reflect the provider's own market state.
8. **Tests.** Unit tests for the parser and the symbol mapping, plus a manual
   desktop smoke test with the real key. The E2E suite stays on the mock so it
   does not depend on market hours or a network.
9. **Documentation.** Update `markdown/data-layer.md` with the provider, the
   endpoint, the mapping table and the rate limits.

## Part 3: the short version

If you want the fastest safe path, give me these four things:

1. Provider and plan.
2. A redacted capture of one real message or response.
3. The exact symbol list, including how your provider writes the indices.
4. Confirmation of real time versus delayed, and whether the key may live in the
   desktop binary or must be proxied through Rust.

With those four I can have the app on real data with a tested parser and no
mock anywhere in the path, while keeping the mock adapter for offline work and
CI.
