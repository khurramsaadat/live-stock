import type { MarketSymbol } from "./types";

/**
 * Baseline values are mock fixtures used by the mock feed and by the first
 * paint before a live feed reports in. Swap these for a real provider payload
 * when the data source is connected.
 */
export const INDICES: MarketSymbol[] = [
  { symbol: "^GSPC", name: "S&P 500", kind: "index", previousClose: 6842.31 },
  { symbol: "^IXIC", name: "Nasdaq Composite", kind: "index", previousClose: 23418.57 },
  { symbol: "^DJI", name: "Dow Jones Industrial Average", kind: "index", previousClose: 51770.31 },
  { symbol: "^RUT", name: "Russell 2000", kind: "index", previousClose: 2811.84 },
];

export const WATCHLIST_UNIVERSE: MarketSymbol[] = [
  { symbol: "NVDA", name: "Nvidia", kind: "equity", previousClose: 188.92 },
  { symbol: "MSFT", name: "Microsoft", kind: "equity", previousClose: 512.44 },
  { symbol: "AAPL", name: "Apple", kind: "equity", previousClose: 264.18 },
  { symbol: "AMZN", name: "Amazon", kind: "equity", previousClose: 236.71 },
  { symbol: "GOOGL", name: "Alphabet", kind: "equity", previousClose: 318.55 },
  { symbol: "META", name: "Meta Platforms", kind: "equity", previousClose: 648.22 },
  { symbol: "NFLX", name: "Netflix", kind: "equity", previousClose: 112.4 },
  { symbol: "AMD", name: "Advanced Micro Devices", kind: "equity", previousClose: 214.63 },
  { symbol: "INTC", name: "Intel", kind: "equity", previousClose: 38.42 },
  { symbol: "ORCL", name: "Oracle", kind: "equity", previousClose: 292.15 },
  { symbol: "IBM", name: "IBM", kind: "equity", previousClose: 288.6 },
  { symbol: "TSLA", name: "Tesla", kind: "equity", previousClose: 421.05 },
  { symbol: "JPM", name: "JPMorgan Chase", kind: "equity", previousClose: 291.28 },
  { symbol: "XOM", name: "Exxon Mobil", kind: "equity", previousClose: 118.34 },
];

export const DEFAULT_WATCHLIST = [
  "NVDA",
  "MSFT",
  "AAPL",
  "AMZN",
  "GOOGL",
  "META",
  "NFLX",
  "AMD",
  "INTC",
  "ORCL",
  "IBM",
];

export const ALL_SYMBOLS: MarketSymbol[] = [...INDICES, ...WATCHLIST_UNIVERSE];

export function findSymbol(symbol: string): MarketSymbol | undefined {
  return ALL_SYMBOLS.find((entry) => entry.symbol === symbol);
}
