# Testing

Three layers, each answering a different question.

| Layer | Tool | Question it answers |
| --- | --- | --- |
| Unit | Vitest | Do the feed, the session clock, formatting and the watchlist store behave? |
| Component | Vitest with React Testing Library | Does a component render and respond to a user? |
| Desktop E2E | WebdriverIO with tauri-driver | Does the compiled Windows app show the right thing and react to real clicks? |

## Current results

| Suite | Result |
| --- | --- |
| Vitest | 11 files, 63 tests, all passing |
| WebdriverIO desktop | 1 spec file, 8 tests, all passing in about 5 minutes |

## Vitest setup

Configuration lives in `vitest.config.mts`:

- `environment: "jsdom"` for a DOM.
- `@vitejs/plugin-react` so JSX and Fast Refresh era transforms work.
- Alias `@` to the project root, matching `tsconfig.json`.
- `setupFiles: ["./tests/setup.ts"]`, which registers `@testing-library/jest-dom`
  matchers, cleans up after each test, resets fake timers, and stubs
  `matchMedia`.

Tests live outside the app tree:

```
tests/setup.ts              matchers and cleanup
tests/fixtures.ts           quote builders used by several suites
tests/unit/                  formatting, session, mock feed, feed factory, hooks
tests/components/            index card, watchlist table, symbol search, pulse rail, dashboard
tests/e2e/                   the desktop spec
```

### What the unit suites cover

- **format**: price grouping, signed changes, percentages, clock output.
- **session**: the open, pre-market, after hours and closed boundaries in New
  York time, using fixed instants so the test never depends on today.
- **mock-feed**: determinism for a fixed seed, one update per symbol per tick,
  different walks for different seeds, and that unsubscribe actually stops the
  interval.
- **create-feed**: environment parsing, unknown mode fallback, and the rule that
  a live mode without a URL falls back to mock.
- **use-watchlist**: defaults, add, case normalisation, duplicate and unknown
  rejection, removal, reset, persistence, corrupt storage, and two consumers
  staying in sync.
- **use-market-feed**: initial previous close, status going live, history growth
  under fake timers, change math, and last update derivation.

### What the component suites cover

- **IndexCard**: level, change, percent, direction attribute, sparkline, day
  range marker, and the decline case.
- **WatchlistTable**: supplied order, sorting by price descending then ascending
  with `aria-sort`, alphabetical sorting, remove callback, row content, and the
  empty state.
- **AddSymbol**: filtering by ticker and by name, adding from the Track button,
  adding by clicking an option, the no match message, Escape closing the list,
  and the disabled state when everything is already tracked.
- **PulseRail**: breadth counts, leaders and laggards ordering, adapter and
  stream labels, and the no gainers case.
- **Dashboard**: section headings, four index cards, eleven default rows, the
  search field, the session badge, and the disclaimer.

## Commands (PowerShell)

```powershell
npm run test
npm run test:watch
npm run typecheck
npm run lint
```

## Desktop E2E

### How it works

1. `npm run e2e:build` produces `src-tauri\target\debug\live-stocks.exe`. This
   runs `npm run build` first, so the executable embeds the real static export.
2. WebdriverIO starts `tauri-driver` on port 4444 with the external provider.
3. The service detects the installed Edge version, ensures a matching
   `msedgedriver`, and launches the app.
4. The spec drives the real WebView2 window.

The harness is `wdio.conf.ts`. The service is `@wdio/tauri-service` with:

- `driverProvider: "external"` because the app does not ship the embedded
  WebDriver plugin.
- `autoInstallTauriDriver: true` and `autoDownloadEdgeDriver: true` so a clean
  machine converges without manual version matching.
- `captureFrontendLogs` and `captureBackendLogs` disabled. With them on, the
  service injected a five kilobyte script before every single command, and a
  nine test run took over five minutes while producing a 25MB log.

To test a release build instead of the debug binary:

```powershell
npm run desktop:build
$env:TAURI_E2E_BINARY = "$PWD\src-tauri\target\release\live-stocks.exe"
npm run test:e2e
```

### What the desktop spec checks

1. The window title settles on Live Stocks.
2. The dashboard headings render.
3. The symbol search and the session badge are visible.
4. Four index panels exist, including S&P 500 and Nasdaq.
5. The watchlist has at least eleven rows and NVDA shows a price.
6. The viewport is at least 1024 by 600, proving the window opened at desktop size.
7. Typing `TSLA` and pressing Track adds the row.
8. Sorting by last price puts META first and reports a descending sort.
9. The footer carries the simulated data and not investment advice line.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `Cannot find native binding` from rolldown | npm skipped optional dependencies | `npm i -D @rolldown/binding-win32-x64-msvc@1.2.16`, already pinned in the project |
| `Cannot read properties of undefined (reading 'bind')` in undici | jsdom 30 needs Node 22.22, this machine runs 22.14 | jsdom is pinned to 27 |
| WebDriver session hangs | Edge and msedgedriver major versions differ | The service auto-downloads; if it is blocked, install the driver manually and put it on PATH |
| `Tauri plugin not available` warnings | The service cannot focus windows without `tauri-plugin-wdio` | Harmless but noisy, it adds a warning per command |
| Sorting test fails on a different first row | Prices move, and a stale localStorage may hold extra symbols | The spec expects META, which is far above the next symbol |
| E2E cannot find the exe | The binary was not built | `npm run e2e:build` |
| Port 4444 already in use | A previous driver was left running | Stop `tauri-driver.exe`, the service starts a fresh one |

## What is not covered yet

- A real provider: parser fixtures and a live smoke test arrive with the
  integration.
- Exchange holidays in the session clock.
- Visual regression screenshots.
- Update flow and code signing, which belong to Milestone 5.
- Cross platform packaging.

## Notes for CI

- Run the Vitest suite on any runner; it needs no display.
- Run the E2E suite on `windows-latest`. It needs a real desktop session, and
  Windows runners have one.
- Cache the Rust target directory and the Edge driver download between runs, or
  a five minute E2E run becomes fifteen.
- Keep the E2E suite on the mock feed. A provider outage should never make the
  build red.
