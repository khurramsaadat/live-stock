# Desktop shell (Tauri v2)

The Rust side is intentionally small: a window, a logging plugin in debug, and
the scaffold that the updater will plug into later.

## Configuration, `src-tauri/tauri.conf.json`

| Field | Value | Why |
| --- | --- | --- |
| `productName` | Live Stocks | Window and installed app name |
| `version` | 0.1.0 | Also the updater comparison value |
| `identifier` | com.livestocks.desktop | Windows app identity, must stay stable for updates |
| `build.frontendDist` | `../out` | The Next static export |
| `build.devUrl` | http://localhost:3000 | Must match `npm run dev` |
| `build.beforeDevCommand` | `npm run dev` | Tauri starts the dev server |
| `build.beforeBuildCommand` | `npm run build` | Produces `out/` before compiling |
| `app.windows[0].width/height` | 1440 x 900 | Desktop default |
| `app.windows[0].minWidth/minHeight` | 1024 x 720 | The layout is tested down to this |
| `app.windows[0].theme` | `Light` | Native title bar stays in daylight mode |
| `app.security.csp` | see below | Restricts what the web view may load |
| `bundle.targets` | `nsis` | Preferred installer for the updater |

### CSP

```
default-src 'self';
img-src 'self' data:;
style-src 'self' 'unsafe-inline';
connect-src 'self' ipc: http://ipc.localhost https: wss:
```

`style-src 'unsafe-inline'` is required by Next's inlined critical styles.
`connect-src` includes `ipc:` for Tauri commands and allows any secure host so
a market data provider works without editing the config. Once a provider is
chosen, replace `https:` and `wss:` with the exact hosts.

## Rust code

- `src-tauri/src/main.rs` is three lines. It calls the library, and it keeps the
  Windows subsystem attribute so no console window appears in release builds.
- `src-tauri/src/lib.rs` builds the app, registers the logging plugin in debug,
  and calls `generate_context!`.
- `src-tauri/capabilities/default.json` grants only `core:default` to the main
  window. Any new native capability must be added there explicitly, not with a
  wildcard.

Crate names: package `live-stocks`, library `live_stocks_lib`, binary
`live-stocks.exe`. The Rust edition is 2024 and the minimum Rust version is
1.90.

## Commands

```powershell
npm run dev
npm run desktop:dev
npm run desktop:build
npm run e2e:build
```

- `desktop:dev` opens the native window against the dev server. Hot reload works
  because the web view is pointed at Next.
- `desktop:build` produces the NSIS installer under
  `src-tauri\target\release\bundle\nsis\`.
- `e2e:build` produces a debug binary with no installer, used by WebdriverIO.

Add `-- --no-bundle` to skip the installer, or `-- --debug` to compile faster.

## Build outputs

| Command | Artifact |
| --- | --- |
| `cargo check` | Type level verification only |
| `npm run e2e:build` | `src-tauri\target\debug\live-stocks.exe` |
| `npm run desktop:build` | `src-tauri\target\release\live-stocks.exe` plus the NSIS installer |

## Auto updater (Milestone 5, not configured yet)

The intended setup, recorded here so the config is not guessed later:

1. Add `tauri-plugin-updater` to `Cargo.toml` and `@tauri-apps/plugin-updater`
   to the frontend.
2. Register the plugin in `lib.rs` behind `#[cfg(desktop)]`.
3. Generate a signing key pair:
   `npm run tauri signer generate -- -w $env:USERPROFILE\.tauri\live-stocks.key`
4. Put the public key in `plugins.updater.pubkey`, set
   `bundle.createUpdaterArtifacts: true`, and add the endpoint
   `https://github.com/<owner>/<repo>/releases/latest/download/latest.json`.
5. Store the private key and its password as repository secrets:
   `TAURI_SIGNING_PRIVATE_KEY` and `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`.
6. Add a check on startup with `check()` from the updater plugin, download and
   install on user confirmation, then relaunch through
   `@tauri-apps/plugin-process`.

Signing keys are ignored by git through `*.key` and `*.key.pub` entries in
`.gitignore`. Never regenerate a key after shipping: an existing install will
reject updates signed with a different key.

## Windows notes

- WebView2 is preinstalled on Windows 11. Windows 10 needs the Evergreen
  Runtime.
- Building needs the Visual Studio C++ build tools and Rust stable 1.90 or newer.
- The first build compiles several hundred crates and takes minutes. Later
  builds are incremental.
- Debug builds open a devtools window when `tauri dev` is used. Release builds do
  not.
