import type { MarketSymbol } from "./types";

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
  { symbol: "AVGO", name: "Broadcom", kind: "equity", previousClose: 326.08 },
  { symbol: "LLY", name: "Eli Lilly", kind: "equity", previousClose: 1417.54 },
  { symbol: "BRK.B", name: "Berkshire Hathaway", kind: "equity", previousClose: 520.12 },
  { symbol: "WMT", name: "Walmart", kind: "equity", previousClose: 123.51 },
  { symbol: "V", name: "Visa", kind: "equity", previousClose: 413.59 },
  { symbol: "JNJ", name: "Johnson & Johnson", kind: "equity", previousClose: 148.25 },
  { symbol: "MA", name: "Mastercard", kind: "equity", previousClose: 570.33 },
  { symbol: "COST", name: "Costco", kind: "equity", previousClose: 1028.45 },
  { symbol: "KO", name: "Coca-Cola", kind: "equity", previousClose: 63.82 },
  { symbol: "PEP", name: "PepsiCo", kind: "equity", previousClose: 142.67 },
  { symbol: "PFE", name: "Pfizer", kind: "equity", previousClose: 25.44 },
  { symbol: "BA", name: "Boeing", kind: "equity", previousClose: 175.38 },
  { symbol: "DIS", name: "Walt Disney", kind: "equity", previousClose: 112.88 },
  { symbol: "CRM", name: "Salesforce", kind: "equity", previousClose: 342.71 },
  { symbol: "UBER", name: "Uber", kind: "equity", previousClose: 82.45 },
  { symbol: "PLTR", name: "Palantir", kind: "equity", previousClose: 68.92 },
  { symbol: "CSCO", name: "Cisco", kind: "equity", previousClose: 58.76 },
  { symbol: "QCOM", name: "Qualcomm", kind: "equity", previousClose: 168.23 },
  { symbol: "BAC", name: "Bank of America", kind: "equity", previousClose: 44.87 },
  { symbol: "GS", name: "Goldman Sachs", kind: "equity", previousClose: 612.55 },
  { symbol: "MS", name: "Morgan Stanley", kind: "equity", previousClose: 125.42 },
  { symbol: "WFC", name: "Wells Fargo", kind: "equity", previousClose: 74.68 },
  { symbol: "CRWD", name: "CrowdStrike", kind: "equity", previousClose: 385.22 },
  { symbol: "CAT", name: "Caterpillar", kind: "equity", previousClose: 384.15 },
  { symbol: "HD", name: "Home Depot", kind: "equity", previousClose: 412.33 },
  { symbol: "ABBV", name: "AbbVie", kind: "equity", previousClose: 192.45 },
  { symbol: "CVX", name: "Chevron", kind: "equity", previousClose: 155.72 },
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
