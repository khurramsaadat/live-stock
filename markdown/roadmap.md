# Roadmap and status

## Milestones

| # | Milestone | Status |
| --- | --- | --- |
| 1 | Workspace, typography, desktop shell, blank canvas | Done |
| 2 | Skeleton components and mocked live data flow | Done |
| 3 | Bespoke dashboard design under the UI rules | Done |
| 3a | Competitive parity pass against five market sites | Done |
| 4 | Vitest suites and WebdriverIO Tauri E2E | In progress, unit and component suites green, desktop suite running |
| 5 | Updater signing, `latest.json`, GitHub Actions release | Not started |

## What exists today

- Next.js 16 static export that also runs inside Tauri v2 on Windows.
- Four indices with sparkline and day range, an eleven symbol default watchlist
  with search, sortable columns, tick tinting, and a market pulse rail.
- Feed layer with mock, WebSocket and polling adapters, selectable by
  environment variable, with backoff and status reporting.
- Explicit US session badge and a shared clock.
- Unit and component test suites, plus a desktop E2E spec that drives the built
  executable.
- Documentation in this folder.

## Milestone 4 remaining

- Confirm the full desktop suite green.
- Add a parser fixture test pattern so a real provider adapter lands with tests.

## Milestone 5 scope

1. Generate the Tauri signing key pair and store the private key, never commit it.
2. Add `tauri-plugin-updater` and `@tauri-apps/plugin-updater`, set
   `createUpdaterArtifacts`, `pubkey`, and the GitHub releases endpoint.
3. Add an in app update check with a user confirmation step and relaunch.
4. Write `.github/workflows/release.yml` that runs on tag push, runs
   `npm run test` and the E2E suite on Windows, then builds and publishes with
   `tauri-apps/tauri-action@v1`, uploading the installer, signature and
   `latest.json`.
5. Add a `latest.json` verification step so a broken update manifest fails the
   workflow instead of reaching users.

## Known gaps

| Gap | Impact | Candidate fix |
| --- | --- | --- |
| No real provider connected | Data is simulated | See [live-data-setup.md](live-data-setup.md) |
| No exchange holiday calendar | Session badge can say Open on a holiday | Add a holiday table to `lib/market/session.ts` |
| E2E run is slow and warns per command | 5 minutes for 8 tests | Add `tauri-plugin-wdio` or accept it in CI |
| No row reordering or multiple lists | Less flexible than TradingView | Deferred, needs a storage schema |
| No extended hours or fundamentals | Less data than Yahoo | Needs a provider that supplies them |
| No mac or Linux packaging | Windows only for now | Tauri supports it, needs CI runners and testing |

## Out of scope by choice

- Accounts, sync and a portfolio ledger.
- News, alerts, earnings and IPO calendars.
- Sector heatmaps, options chains, crypto.
- A dark theme.
- A mobile app. Tauri can target it, the interface is not designed for it.
