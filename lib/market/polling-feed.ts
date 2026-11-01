import type { FeedHandler, FeedStatus, FeedUpdate, MarketFeed, MarketSymbol } from "./types";

export interface PollingFeedOptions {
  symbols: MarketSymbol[];
  /** Builds the request URL for the current symbol set. */
  buildUrl: (symbols: string[]) => string;
  /** Map a vendor payload to zero, one or many updates. */
  parseResponse: (payload: unknown) => FeedUpdate[];
  intervalMs?: number;
  requestInit?: RequestInit;
}

/**
 * Read only HTTP polling adapter for providers that expose a REST quote
 * endpoint. Keeps the last known price per symbol and only emits changes.
 *
 * Twelve Data example, one symbol per request is the cheap tier:
 *
 *   const feed = createPollingFeed({
 *     symbols: ALL_SYMBOLS,
 *     buildUrl: (symbols) =>
 *       `https://api.twelvedata.com/quote?symbol=${symbols[0]}&apikey=${process.env.NEXT_PUBLIC_TWELVE_DATA_KEY}`,
 *     parseResponse: (payload) => {
 *       const quote = payload as { symbol?: string; close?: string; timestamp?: string };
 *       if (!quote.symbol || !quote.close) return [];
 *       return [{
 *         symbol: quote.symbol,
 *         price: Number(quote.close),
 *         at: Number(quote.timestamp ?? Date.now()) * 1000,
 *       }];
 *     },
 *   });
 */
export function createPollingFeed(options: PollingFeedOptions): MarketFeed {
  const { symbols, buildUrl, parseResponse, intervalMs = 5000, requestInit } = options;

  return {
    kind: "polling",
    connect({ onUpdate, onStatus }: FeedHandler) {
      let stopped = false;
      let timer: ReturnType<typeof setTimeout> | undefined;
      const controller = new AbortController();
      const lastPrice = new Map<string, number>();
      let failures = 0;

      const setStatus = (status: FeedStatus, detail?: string) => {
        if (!stopped) onStatus(status, detail);
      };

      const poll = async () => {
        try {
          const response = await fetch(buildUrl(symbols.map((entry) => entry.symbol)), {
            ...requestInit,
            signal: controller.signal,
            cache: "no-store",
          });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);

          const payload: unknown = await response.json();
          failures = 0;
          setStatus("live", "polling");

          for (const update of parseResponse(payload)) {
            if (lastPrice.get(update.symbol) === update.price) continue;
            lastPrice.set(update.symbol, update.price);
            onUpdate(update);
          }
        } catch (error) {
          if (stopped) return;
          failures += 1;
          const reason = error instanceof Error ? error.message : "request failed";
          setStatus(failures > 3 ? "error" : "stalled", reason);
        } finally {
          if (!stopped) {
            const nextDelay = Math.min(intervalMs * Math.max(1, failures), intervalMs * 6);
            timer = setTimeout(poll, nextDelay);
          }
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
