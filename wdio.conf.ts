import path from "node:path";

/**
 * End to end tests drive the compiled Tauri window with the real WebView2
 * engine, through tauri-driver and a matching msedgedriver.
 *
 * Build the binary first: `npm run e2e:build`. Point TAURI_E2E_BINARY at a
 * release build when you want the exact installer payload tested.
 */
const binaryPath =
  process.env.TAURI_E2E_BINARY ??
  path.resolve(process.cwd(), "src-tauri", "target", "debug", "live-stocks.exe");

// The Tauri capability keys are not part of WebdriverIO's own types, so the
// object is intentionally untyped.
export const config = {
  runner: "local",
  specs: ["./tests/e2e/**/*.e2e.ts"],
  maxInstances: 1,
  capabilities: [
    {
      browserName: "tauri",
      "tauri:options": {
        application: binaryPath,
      },
    },
  ],
  services: [
    [
      "@wdio/tauri-service",
      {
        appBinaryPath: binaryPath,
        // tauri-driver talks to msedgedriver. The embedded provider would need
        // a Rust plugin that this app does not ship.
        driverProvider: "external",
        autoInstallTauriDriver: true,
        autoDownloadEdgeDriver: true,
        // Injecting console forwarding before every command made a nine test
        // run take five minutes and produced a 25MB log.
        captureFrontendLogs: false,
        captureBackendLogs: false,
      },
    ],
  ],
  // The service logs every command at info, which buries the results.
  logLevel: "warn",
  bail: 0,
  waitforTimeout: 15000,
  connectionRetryTimeout: 180000,
  connectionRetryCount: 2,
  framework: "mocha",
  reporters: ["spec"],
  mochaOpts: {
    ui: "bdd",
    timeout: 120000,
  },
};
