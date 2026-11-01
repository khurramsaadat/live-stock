# Live Stocks documentation

This folder is the map of the application. Each file stands on its own, so you
can read the one you need without the rest.

| Document | Read it when you need to |
| --- | --- |
| [architecture.md](architecture.md) | Understand how the pieces fit, where state lives, and how a price reaches the screen |
| [design-system.md](design-system.md) | Change the look, add a component, or check a colour and type rule |
| [data-layer.md](data-layer.md) | Connect a real market data provider, or change how quotes are derived |
| [testing.md](testing.md) | Run tests, add a test, or fix a failing desktop E2E session |
| [live-data-setup.md](live-data-setup.md) | Replace the mock feed with a real provider, and see what is needed from you |
| [desktop.md](desktop.md) | Work on the Tauri shell, window settings, CSP, and packaging |
| [decisions.md](decisions.md) | Find out why something is the way it is before changing it |
| [competitive-analysis.md](competitive-analysis.md) | Compare features against Yahoo Finance, MarketWatch, Google Finance, Bloomberg and TradingView |
| [roadmap.md](roadmap.md) | See what is built, what is pending, and what is deliberately out of scope |

The project level [README](../README.md) holds the install and PowerShell
command reference.

## In one paragraph

Live Stocks is a Next.js 16 App Router application that compiles to a static
export and ships inside a Tauri v2 window as a native Windows desktop app. It
shows four major indices and a user watchlist, updated by a feed adapter that
currently runs a deterministic mock but can be pointed at a WebSocket or HTTP
polling provider through environment variables. Styling is Tailwind CSS v4
against a daylight-only token set: warm neutral paper, amber for system state,
emerald and rust for direction. There is no backend, no account, and no
database. The watchlist lives in localStorage.

## Repository tour

```
app/                    Next.js App Router entry point and global CSS
components/market/      Every visible market component
lib/market/             Types, feed adapters, hooks, formatting, session clock
tests/                  Vitest unit and component suites, WebdriverIO E2E spec
src-tauri/              Rust shell, window config, capabilities, icons
markdown/               This documentation
```

## Fast facts

| Item | Value |
| --- | --- |
| Framework | Next.js 16.4.3 with App Router, static export |
| UI runtime | React 19.3.0 |
| Language | TypeScript 6.0.3 |
| Styling | Tailwind CSS v4 |
| Desktop | Tauri CLI 2.12.4, tauri crate 2.12.5 |
| Unit tests | Vitest 5.0.5 with React Testing Library |
| E2E | WebdriverIO 9 with the Tauri service and tauri-driver |
| Dev URL | http://localhost:3000 |
| Theme | Daylight only |
