# Decisions

Short records of choices that are expensive to reverse. Each one states the
context, the decision, and what it costs.

## 1. Static export inside Tauri, no Node sidecar

**Context.** The app must run as a web page and as a desktop application.

**Decision.** Next.js runs with `output: "export"` and the desktop build embeds
the resulting `out/` directory. Tauri serves it over its asset protocol.

**Consequence.** No server components at request time, no route handlers, no
middleware, no `next/image` optimisation. Everything interactive is a client
component. In exchange the desktop app has no extra process, no port, and no
Node runtime to ship. Any future server need has to be met by a Rust command,
not by Next.

## 2. Daylight only, no dark theme

**Context.** Most finance sites ship both themes, and dark is common in trading
tools.

**Decision.** The palette is defined once for a warm daylight surface. There is
no dark variant and no `prefers-color-scheme` branch. Tauri is configured with
`theme: "Light"` so the native chrome matches.

**Consequence.** One palette to maintain and one set of contrast values to
verify. Users who need dark mode are not served. If it is ever added, the tokens
in `app/globals.css` are the only place to change.

## 3. One feed interface with a mock first

**Context.** Real market data needs a paid key, licensing, and network access,
none of which exist in CI.

**Decision.** `MarketFeed` is the only contact point. The mock adapter is the
default, and a live mode without a URL falls back to it.

**Consequence.** The UI, the tests and the E2E suite never depend on market
hours or a provider. The cost is that the app can lie about being live if the
labels are wrong, which is why the footer states simulated data whenever the
adapter is mock.

## 4. TypeScript 6.0.3, not 7

**Context.** TypeScript 7.0.2 is the latest stable release. `typescript-eslint`,
which ships inside `eslint-config-next`, throws on load against it.

**Decision.** Pin 6.0.3, the newest supported release.

**Consequence.** Linting works. The project is one major behind on TypeScript
until the lint stack declares support. Documented in the root README so it is
not mistaken for an oversight.

## 5. Watchlist in localStorage through an external store

**Context.** The watchlist must persist and be readable by more than one
component.

**Decision.** A small store in `use-watchlist.ts` built on
`useSyncExternalStore`, with a cached snapshot and a constant server snapshot.

**Consequence.** No provider tree, no context, no hydration mismatch in the
static export, and two consumers stay in sync. The cost is roughly eighty lines
of store plumbing instead of a five line `useState` plus an effect, which the
React Compiler rules rightly reject anyway.

## 6. WebdriverIO with the external Tauri driver

**Context.** Tauri E2E needs a WebDriver implementation. The service defaults to
an embedded driver that requires adding a Rust plugin to the app.

**Decision.** Use `@wdio/tauri-service` with `driverProvider: "external"`, which
drives `tauri-driver` and auto-downloads a matching `msedgedriver`.

**Consequence.** No extra Rust plugin and no change to the shipped app. The
service warns on every command because it cannot focus windows without that
plugin, which makes a run slower and noisier than it could be. Installing
`tauri-plugin-wdio` later would remove the warnings and enable command mocking.

## 7. jsdom 27, not 30

**Context.** jsdom 30 requires Node `^22.22.2`. The machine runs Node 22.14.

**Decision.** Pin jsdom 27, whose engine range includes 22.14.

**Consequence.** Tests run. The DOM implementation is slightly older. Upgrading
Node is the cleaner long term fix.

## 8. A single shared clock store

**Context.** A clock in the masthead, a date beside it, and a session badge each
originally ran their own interval, and the session badge sat on a placeholder
for up to thirty seconds.

**Decision.** One module store, `lib/market/use-now.ts`, ticking once per second,
consumed by `SessionClock` and `SessionBadge` through `useSyncExternalStore`.

**Consequence.** One timer, one re-render per second, no placeholder delay. All
time displays move together by construction.

## 9. Hand built sparklines

**Context.** Chart libraries are large and mostly unnecessary for a 60 point
line.

**Decision.** A small SVG component that normalises the history and draws a
polyline with a draw-in animation.

**Consequence.** Roughly one kilobyte of code, no dependency, full control of
stroke weight and colour. If candlesticks or axes are ever needed, that is the
moment to bring in a library.

## 10. Amber means state, emerald and rust mean direction

**Context.** Finance UIs often use colour for both decoration and meaning, which
makes red and green ambiguous.

**Decision.** Amber is reserved for system state, focus and the primary action.
Emerald and rust are used only for price direction. No other accent colours and
no blue.

**Consequence.** A glance at a colour tells you what kind of information it is.
The palette is narrower than most finance sites, which is the point.
