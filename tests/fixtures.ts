import { INDICES, WATCHLIST_UNIVERSE } from "@/lib/market/universe";
import type { Quote } from "@/lib/market/types";

/** Builds a quote from a previous close and a price, keeping the maths honest. */
export function makeQuote(overrides: Partial<Quote> & { symbol: string; price: number }): Quote {
  const previousClose = overrides.previousClose ?? 100;
  const change = overrides.price - previousClose;

  return {
    name: overrides.symbol,
    kind: "equity",
    previousClose,
    change,
    changePercent: (change / previousClose) * 100,
    history: [previousClose, overrides.price],
    updatedAt: 1_700_000_000_000,
    ...overrides,
  };
}

export function makeIndexQuotes(): Quote[] {
  return INDICES.map((entry) =>
    makeQuote({
      symbol: entry.symbol,
      name: entry.name,
      kind: "index",
      previousClose: entry.previousClose,
      price: entry.previousClose * 1.004,
    }),
  );
}

export function makeEquityQuotes(): Quote[] {
  return WATCHLIST_UNIVERSE.map((entry, index) =>
    makeQuote({
      symbol: entry.symbol,
      name: entry.name,
      kind: "equity",
      previousClose: entry.previousClose,
      price: entry.previousClose * (1 + (index % 5 - 2) / 500),
    }),
  );
}
