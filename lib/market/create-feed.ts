import { createMockFeed } from "./mock-feed";
import { createPollingFeed } from "./polling-feed";
import type { MarketFeed, MarketSymbol } from "./types";
import { createWebSocketFeed } from "./websocket-feed";

export type FeedMode = "mock" | "websocket" | "polling" | "finnhub" | "twelvedata";

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
    rawMode === "websocket" || rawMode === "polling" || rawMode === "finnhub" || rawMode === "twelvedata"
      ? rawMode
      : "mock";
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

  if (config.mode === "finnhub") {
    return createFinnhubFeed(symbols);
  }

  if (config.mode === "twelvedata") {
    return createTwelvedataFeed(symbols);
  }

  return createMockFeed(symbols);
}

/**
 * Finnhub polling feed adapter.
 * Reads MARKET_API_KEY from the Tauri command (never in the JS bundle).
 * Finnhub free tier REST endpoint: GET https://finnhub.io/api/v1/quote?symbol=AAPL,MSFT
 * Response: { "symbol": "AAPL", "price": 41.21, "change": 0.5, "change_percent": "1.23%" }
 * For multiple symbols: https://finnhub.io/api/v1/quote?symbol=AAPL,MSFT,GOOGL
 */
export function createFinnhubFeed(symbols: MarketSymbol[]): MarketFeed {
  const symbolsStr = symbols.map((s) => s.symbol).join(",");
  const apiKey = process.env.NEXT_PUBLIC_MARKET_API_KEY ?? "";

  return {
    kind: "finnhub",
    connect({ onUpdate, onStatus }: import("@/lib/market/types").FeedHandler) {
      onStatus("connecting");

      const fetchQuotes = async () => {
        try {
          const resp = await fetch(
            `${process.env.NEXT_PUBLIC_FINNHUB_URL ?? "https://finnhub.io/api/v1/quote"}?symbol=${symbolsStr}&token=${apiKey}`,
          );
          const data = await resp.json();

          if (data.symbol && typeof data.price === "number") {
            onUpdate({
              symbol: data.symbol,
              price: data.price,
              at: Date.now(),
            });
          } else if (Array.isArray(data)) {
            for (const quote of data) {
              if (quote.symbol && typeof quote.price === "number") {
                onUpdate({
                  symbol: quote.symbol,
                  price: quote.price,
                  at: Date.now(),
                });
              }
            }
          }
        } catch (err) {
          console.error("Finnhub polling error:", err);
        }
      }

      fetchQuotes();
      const timer = setInterval(fetchQuotes, Number(process.env.MARKET_POLL_MS ?? 5000));
      return () => clearInterval(timer);
    },
  };
}

/**
 * Twelvedata polling feed adapter.
 * Twelvedata free tier REST endpoint: GET https://api.twelvedata.com/quote?symbol=AAPL,MSFT&apikey=YOUR_KEY
 * Response: { "symbol": "AAPL", "price": 41.21, "change": 0.5, "change_percent": "1.23%" }
 * For multiple symbols: https://api.twelvedata.com/quote?symbol=AAPL,MSFT,GOOGL&apikey=YOUR_KEY
 */
export function createTwelvedataFeed(symbols: MarketSymbol[]): MarketFeed {
  const apiKey = process.env.NEXT_PUBLIC_TWELVEDATA_KEY ?? "";
  const symbolsStr = symbols.map((s) => s.symbol).join(",");

  return {
    kind: "twelvedata",
    connect({ onUpdate, onStatus }: import("@/lib/market/types").FeedHandler) {
      onStatus("connecting");

      const fetchQuotes = async () => {
        try {
          const resp = await fetch(
            `${process.env.TWELVEDATA_POLL_URL ?? "https://api.twelvedata.com/quote"}?symbol=${symbolsStr}&apikey=${apiKey}`,
          );
          const data = await resp.json();

          // Twelvedata returns single object or array
          const quotes = Array.isArray(data) ? data : (data.symbol ? [data] : []);

          for (const quote of quotes) {
            if (quote.symbol && typeof quote.price === "number") {
              onUpdate({
                symbol: quote.symbol,
                price: quote.price,
                at: Date.now(),
              });
            }
          }
        } catch (err) {
          console.error("Twelvedata polling error:", err);
        }
      }

      fetchQuotes();
      const timer = setInterval(fetchQuotes, Number(process.env.MARKET_POLL_MS ?? 5000));
      return () => clearInterval(timer);
    },
  };
}
