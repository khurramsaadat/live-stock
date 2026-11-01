import { createMockFeed } from "./mock-feed";
import { createPollingFeed } from "./polling-feed";
import type { FeedHandler, FeedStatus, FeedUpdate, MarketFeed, MarketSymbol } from "./types";
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
    return createFinnhubFeed(symbols, config.intervalMs);
  }

  if (config.mode === "twelvedata") {
    return createTwelvedataFeed(symbols);
  }

  return createMockFeed(symbols);
}

const FINNHUB_QUOTE_URL = "https://finnhub.io/api/v1/quote";

interface FinnhubQuotePayload {
  /** Current price. */
  c?: number;
  /** Change, and change percent. */
  d?: number | null;
  dp?: number | null;
  /** Day high, low and open. */
  h?: number;
  l?: number;
  o?: number;
  /** Previous close, the baseline for the change. */
  pc?: number;
  /** Epoch seconds of the last trade. */
  t?: number;
  /** Finnhub answers 200 with this shape when the plan cannot serve a symbol. */
  error?: string;
}

/**
 * Finnhub polling feed adapter.
 *
 * Finnhub takes exactly one symbol per request, so each poll issues one
 * request per symbol in parallel:
 *
 *   GET https://finnhub.io/api/v1/quote?symbol=AAPL&token=YOUR_KEY
 *   {"c":344.63,"d":-4.28,"dp":-1.2267,...,"pc":348.91,"t":1793390400}
 *
 * A comma separated list is not supported and answers with zeroes. Index
 * symbols such as ^GSPC sit behind a paid plan and answer with an error
 * object. In both cases the symbol is dropped from later polls and its row
 * keeps the baseline close, so one unsupported symbol cannot blank the desk.
 */
export function createFinnhubFeed(symbols: MarketSymbol[], intervalMs = 5000): MarketFeed {
  const apiKey = process.env.NEXT_PUBLIC_MARKET_API_KEY ?? "";
  const quoteUrl = process.env.NEXT_PUBLIC_FINNHUB_URL ?? FINNHUB_QUOTE_URL;

  return {
    kind: "finnhub",
    connect({ onUpdate, onStatus }: FeedHandler) {
      if (!apiKey) {
        onStatus("error", "missing NEXT_PUBLIC_MARKET_API_KEY");
        return () => {};
      }

      let stopped = false;
      let timer: ReturnType<typeof setTimeout> | undefined;
      const controller = new AbortController();
      const lastPrice = new Map<string, number>();
      /** Symbols this plan cannot serve. Asking again would only waste calls. */
      const unavailable = new Set<string>();
      let failures = 0;
      let lastError: string | undefined;

      const setStatus = (status: FeedStatus, detail?: string) => {
        if (!stopped) onStatus(status, detail);
      };

      const requestQuote = async (symbol: string) => {
        const response = await fetch(
          `${quoteUrl}?symbol=${encodeURIComponent(symbol)}&token=${encodeURIComponent(apiKey)}`,
          { signal: controller.signal, cache: "no-store" },
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return (await response.json()) as FinnhubQuotePayload;
      };

      const poll = async () => {
        const updates: FeedUpdate[] = [];
        let attempted = 0;

        await Promise.all(
          symbols.map(async (entry) => {
            if (unavailable.has(entry.symbol)) return;
            attempted += 1;

            try {
              const quote = await requestQuote(entry.symbol);
              if (quote.error) throw new Error(quote.error);
              // Finnhub reports zeroes when it has no trade for the symbol.
              if (typeof quote.c !== "number" || quote.c <= 0) throw new Error("no quote");
              const update: FeedUpdate = {
                symbol: entry.symbol,
                price: quote.c,
                at: typeof quote.t === "number" && quote.t > 0 ? quote.t * 1000 : Date.now(),
              };
              if (typeof quote.pc === "number" && quote.pc > 0) {
                update.previousClose = quote.pc;
              }
              updates.push(update);
            } catch (error) {
              if (stopped) return;
              const message = error instanceof Error ? error.message : "request failed";
              const permanent = message === "no quote" || message.toLowerCase().includes("subscription");
              if (permanent) {
                unavailable.add(entry.symbol);
              } else {
                lastError = message;
              }
            }
          }),
        );

        if (stopped) return;

        if (updates.length > 0) {
          failures = 0;
          for (const update of updates) {
            if (lastPrice.get(update.symbol) === update.price) continue;
            lastPrice.set(update.symbol, update.price);
            onUpdate(update);
          }
          const missing = unavailable.size;
          setStatus(
            "live",
            missing > 0 ? `polling, ${missing} of ${symbols.length} symbols not in plan` : "polling",
          );
        } else if (attempted === 0) {
          setStatus("error", "no symbols available on this plan");
          return;
        } else {
          failures += 1;
          setStatus(failures > 3 ? "error" : "stalled", lastError);
        }

        if (!stopped) {
          const nextDelay = Math.min(intervalMs * Math.max(1, failures), intervalMs * 6);
          timer = setTimeout(() => void poll(), nextDelay);
        }
      };

      setStatus("connecting");
      void poll();

      return () => {
        stopped = true;
        if (timer) clearTimeout(timer);
        controller.abort();
        onStatus("idle");
      };
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
    connect({ onUpdate, onStatus }: FeedHandler) {
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
