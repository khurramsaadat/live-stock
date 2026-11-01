import { afterEach, describe, expect, it, vi } from "vitest";
import { createMarketFeed, readFeedConfig } from "@/lib/market/create-feed";
import { INDICES } from "@/lib/market/universe";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("readFeedConfig", () => {
  it("defaults to the mock feed", () => {
    expect(readFeedConfig().mode).toBe("mock");
  });

  it("accepts the known live modes", () => {
    vi.stubEnv("NEXT_PUBLIC_MARKET_FEED", "websocket");
    expect(readFeedConfig().mode).toBe("websocket");
    vi.stubEnv("NEXT_PUBLIC_MARKET_FEED", "polling");
    expect(readFeedConfig().mode).toBe("polling");
  });

  it("ignores an unknown mode", () => {
    vi.stubEnv("NEXT_PUBLIC_MARKET_FEED", "carrier-pigeon");
    expect(readFeedConfig().mode).toBe("mock");
  });

  it("falls back to a five second poll interval", () => {
    vi.stubEnv("NEXT_PUBLIC_MARKET_POLL_MS", "10");
    expect(readFeedConfig().intervalMs).toBe(5000);
  });
});

describe("createMarketFeed", () => {
  it("builds the mock feed by default", () => {
    expect(createMarketFeed(INDICES).kind).toBe("mock");
  });

  it("builds a websocket feed when a URL is configured", () => {
    const feed = createMarketFeed(INDICES, {
      mode: "websocket",
      websocketUrl: "wss://example.test/stream",
    });
    expect(feed.kind).toBe("websocket");
  });

  it("falls back to mock when a live mode has no URL", () => {
    expect(createMarketFeed(INDICES, { mode: "websocket" }).kind).toBe("mock");
    expect(createMarketFeed(INDICES, { mode: "polling" }).kind).toBe("mock");
  });

  it("builds the polling feed when a URL is configured", () => {
    expect(
      createMarketFeed(INDICES, {
        mode: "polling",
        pollingUrl: "https://example.test/quote",
        intervalMs: 1000,
      }).kind,
    ).toBe("polling");
  });
});
