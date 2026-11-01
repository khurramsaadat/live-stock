import { createMockFeed } from "./mock-feed";
import { createPollingFeed } from "./polling-feed";
import type { MarketFeed, MarketSymbol } from "./types";
import { createWebSocketFeed } from "./websocket-feed";

export type FeedMode = "mock" | "websocket" | "polling";

export interface FeedConfig {
  mode: FeedMode;
  websocketUrl?: string;
  pollingUrl?: string;
  intervalMs?: number;
}

/**
 * Environment driven selection, so the dashboard never imports a vendor SDK.
 *
 *   NEXT_PUBLIC_MARKET_FEED=mock
 *   NEXT_PUBLIC_MARKET_WS_URL=wss://your-provider/stream
 *   NEXT_PUBLIC_MARKET_POLL_URL=https://your-provider/quote
 */
export function readFeedConfig(): FeedConfig {
  const rawMode = process.env.NEXT_PUBLIC_MARKET_FEED;
  const mode: FeedMode =
    rawMode === "websocket" || rawMode === "polling" ? rawMode : "mock";
  const interval = Number(process.env.NEXT_PUBLIC_MARKET_POLL_MS ?? 5000);

  return {
    mode,
    websocketUrl: process.env.NEXT_PUBLIC_MARKET_WS_URL,
    pollingUrl: process.env.NEXT_PUBLIC_MARKET_POLL_URL,
    intervalMs: Number.isFinite(interval) && interval >= 1000 ? interval : 5000,
  };
}

/**
 * Builds the feed for the current configuration. A live mode without a
 * configured URL falls back to the mock feed, so the interface is never blank
 * because an environment variable is missing.
 */
export function createMarketFeed(symbols: MarketSymbol[], config = readFeedConfig()): MarketFeed {
  if (config.mode === "websocket" && config.websocketUrl) {
    return createWebSocketFeed({
      url: config.websocketUrl,
      symbols,
      buildSubscribeMessage: (list) => ({ type: "subscribe", symbols: list }),
      // Swap this parser for the provider's documented payload shape.
      parseMessage: (payload) => {
        const message = payload as { symbol?: string; price?: number; at?: number };
        if (!message?.symbol || typeof message.price !== "number") return [];
        return [{ symbol: message.symbol, price: message.price, at: message.at ?? Date.now() }];
      },
    });
  }

  if (config.mode === "polling" && config.pollingUrl) {
    return createPollingFeed({
      symbols,
      intervalMs: config.intervalMs,
      buildUrl: (list) => `${config.pollingUrl}?symbols=${list.join(",")}`,
      // Swap this parser for the provider's documented payload shape.
      parseResponse: (payload) => {
        const body = payload as { quotes?: { symbol?: string; price?: number; at?: number }[] };
        if (!Array.isArray(body?.quotes)) return [];
        return body.quotes.flatMap((quote) =>
          quote.symbol && typeof quote.price === "number"
            ? [{ symbol: quote.symbol, price: quote.price, at: quote.at ?? Date.now() }]
            : [],
        );
      },
    });
  }

  return createMockFeed(symbols);
}
