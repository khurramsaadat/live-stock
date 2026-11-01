import type { FeedHandler, FeedUpdate, MarketFeed, MarketSymbol } from "./types";

export interface MockFeedOptions {
  /** Fixed seed keeps a session reproducible, which unit tests rely on. */
  seed?: number;
  intervalMs?: number;
  /** Fraction of price a single tick may move. */
  volatility?: number;
}

/** Small deterministic PRNG, so the mock feed never uses Math.random. */
function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Local random walk that behaves like a streaming feed. It is the default data
 * source in development and the fixture every component test runs against.
 */
export function createMockFeed(
  symbols: MarketSymbol[],
  options: MockFeedOptions = {},
): MarketFeed {
  const { seed = 42, intervalMs = 1200, volatility = 0.0009 } = options;

  return {
    kind: "mock",
    connect({ onUpdate, onStatus }: FeedHandler) {
      const random = mulberry32(seed);
      const prices = new Map<string, number>(
        symbols.map((entry) => [entry.symbol, entry.previousClose]),
      );

      onStatus("connecting");

      const tick = () => {
        const at = Date.now();
        for (const entry of symbols) {
          const current = prices.get(entry.symbol) ?? entry.previousClose;
          const drift = (random() - 0.5) * 2 * volatility;
          // Keep the walk anchored so long sessions do not run away from the
          // previous close.
          const pull = (entry.previousClose - current) / entry.previousClose * 0.02;
          const next = Math.max(0.01, current * (1 + drift + pull));
          prices.set(entry.symbol, next);

          const update: FeedUpdate = {
            symbol: entry.symbol,
            price: Math.round(next * 100) / 100,
            at,
          };
          onUpdate(update);
        }
      };

      tick();
      onStatus("live", "mock stream");

      const timer = setInterval(tick, intervalMs);
      return () => clearInterval(timer);
    },
  };
}
