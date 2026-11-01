import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const devHost = process.env.TAURI_DEV_HOST ?? "localhost";
const devPort = process.env.TAURI_DEV_PORT ?? "3000";

/**
 * Tauri serves the static export from its own asset protocol, so the app is
 * built as a client rendered shell. In development the webview points at the
 * Next dev server, hence the fixed host and port below.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  assetPrefix: isProd ? undefined : `http://${devHost}:${devPort}`,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
