import { afterEach, describe, expect, it, vi } from "vitest";
import { createFinnhubFeed, createMarketFeed, readFeedConfig } from "@/lib/market/create-feed";
import { INDICES } from "@/lib/market/universe";
import type { FeedStatus, FeedUpdate, MarketSymbol } from "@/lib/market/types";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.useRealTimers();
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
    vi.stubEnv("NEXT_PUBLIC_MARKET_FEED", "finnhub");
    expect(readFeedConfig().mode).toBe("finnhub");
    vi.stubEnv("NEXT_PUBLIC_MARKET_FEED", "twelvedata");
    expect(readFeedConfig().mode).toBe("twelvedata");
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

describe("createFinnhubFeed", () => {
  const symbols: MarketSymbol[] = [
    { symbol: "AAPL", name: "Apple", kind: "equity", previousClose: 340 },
    { symbol: "MSFT", name: "Microsoft", kind: "equity", previousClose: 500 },
    { symbol: "^GSPC", name: "S&P 500", kind: "index", previousClose: 6842.31 },
  ];

  const response = (body: unknown) =>
    ({ ok: true, status: 200, json: async () => body }) as unknown as Response;

  function stubFetch() {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const symbol = new URL(String(input)).searchParams.get("symbol") ?? "";
      if (symbol === "^GSPC") {
        return response({ error: "Market data subscription required for CFD indices." });
      }
      return response({
        c: symbol === "AAPL" ? 344.63 : 512.44,
        pc: symbol === "AAPL" ? 348.91 : 512.44,
        t: 1793390400,
      });
    });
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
  }

  it("asks for one symbol per request and reports live", async () => {
    vi.stubEnv("NEXT_PUBLIC_MARKET_API_KEY", "test-key");
    const fetchMock = stubFetch();

    const updates: FeedUpdate[] = [];
    const statuses: FeedStatus[] = [];
    const disconnect = createFinnhubFeed(symbols, 1000).connect({
      onUpdate: (update) => updates.push(update),
      onStatus: (status) => statuses.push(status),
    });

    await vi.waitFor(() => expect(statuses).toContain("live"));

    const urls = fetchMock.mock.calls.map(([input]) => String(input));
    expect(urls).toHaveLength(3);
    expect(urls).toEqual(
      expect.arrayContaining([
        expect.stringContaining("symbol=AAPL&token=test-key"),
        expect.stringContaining("symbol=MSFT&token=test-key"),
        expect.stringContaining("symbol=%5EGSPC&token=test-key"),
      ]),
    );
    expect(urls.some((url) => url.includes("AAPL,MSFT"))).toBe(false);

    expect(updates).toHaveLength(2);
    expect(updates.find((update) => update.symbol === "AAPL")).toEqual({
      symbol: "AAPL",
      price: 344.63,
      at: 1793390400000,
    });
    expect(updates.find((update) => update.symbol === "^GSPC")).toBeUndefined();

    disconnect();
  });

  it("stops asking for symbols the plan does not serve", async () => {
    vi.useFakeTimers();
    vi.stubEnv("NEXT_PUBLIC_MARKET_API_KEY", "test-key");
    const fetchMock = stubFetch();

    const updates: FeedUpdate[] = [];
    const disconnect = createFinnhubFeed(symbols, 1000).connect({
      onUpdate: (update) => updates.push(update),
      onStatus: () => {},
    });

    await vi.advanceTimersByTimeAsync(0);
    expect(fetchMock).toHaveBeenCalledTimes(3);

    await vi.advanceTimersByTimeAsync(1000);
    // The index is skipped, and unchanged prices are not repeated.
    expect(fetchMock).toHaveBeenCalledTimes(5);
    expect(updates).toHaveLength(2);

    disconnect();
  });

  it("reports an error when the API key is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_MARKET_API_KEY", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const statuses: FeedStatus[] = [];
    const disconnect = createFinnhubFeed(symbols).connect({
      onUpdate: () => {},
      onStatus: (status) => statuses.push(status),
    });

    expect(statuses).toEqual(["error"]);
    expect(fetchMock).not.toHaveBeenCalled();
    disconnect();
  });
});
