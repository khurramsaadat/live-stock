import type { MarketSymbol } from "./types";

export const INDICES: MarketSymbol[] = [
  { symbol: "^GSPC", name: "S&P 500", kind: "index", previousClose: 6842.31 },
  { symbol: "^IXIC", name: "Nasdaq Composite", kind: "index", previousClose: 23418.57 },
  { symbol: "^DJI", name: "Dow Jones Industrial Average", kind: "index", previousClose: 51770.31 },
  { symbol: "^RUT", name: "Russell 2000", kind: "index", previousClose: 2811.84 },
];

export type Sector =
  | "Technology"
  | "Financials"
  | "Healthcare"
  | "Consumer Cyclical"
  | "Consumer Defensive"
  | "Energy"
  | "Industrials"
  | "Communication"
  | "Real Estate"
  | "Utilities"
  | "Materials";

export interface SectorSymbol extends MarketSymbol {
  sector: Sector;
}

export const WATCHLIST_UNIVERSE: SectorSymbol[] = [
  // Technology
  { symbol: "NVDA", name: "Nvidia", kind: "equity", previousClose: 188.92, sector: "Technology" },
  { symbol: "MSFT", name: "Microsoft", kind: "equity", previousClose: 512.44, sector: "Technology" },
  { symbol: "AAPL", name: "Apple", kind: "equity", previousClose: 264.18, sector: "Technology" },
  { symbol: "AVGO", name: "Broadcom", kind: "equity", previousClose: 326.08, sector: "Technology" },
  { symbol: "ORCL", name: "Oracle", kind: "equity", previousClose: 292.15, sector: "Technology" },
  { symbol: "AMD", name: "Advanced Micro Devices", kind: "equity", previousClose: 214.63, sector: "Technology" },
  { symbol: "CRM", name: "Salesforce", kind: "equity", previousClose: 342.71, sector: "Technology" },
  { symbol: "CSCO", name: "Cisco", kind: "equity", previousClose: 58.76, sector: "Technology" },
  { symbol: "INTC", name: "Intel", kind: "equity", previousClose: 38.42, sector: "Technology" },
  { symbol: "IBM", name: "IBM", kind: "equity", previousClose: 288.6, sector: "Technology" },
  { symbol: "QCOM", name: "Qualcomm", kind: "equity", previousClose: 168.23, sector: "Technology" },
  { symbol: "PLTR", name: "Palantir", kind: "equity", previousClose: 68.92, sector: "Technology" },
  { symbol: "CRWD", name: "CrowdStrike", kind: "equity", previousClose: 385.22, sector: "Technology" },
  { symbol: "ADBE", name: "Adobe", kind: "equity", previousClose: 472.88, sector: "Technology" },
  { symbol: "NOW", name: "ServiceNow", kind: "equity", previousClose: 948.31, sector: "Technology" },
  { symbol: "SNPS", name: "Synopsys", kind: "equity", previousClose: 512.76, sector: "Technology" },
  { symbol: "PANW", name: "Palo Alto Networks", kind: "equity", previousClose: 198.44, sector: "Technology" },
  { symbol: "SHOP", name: "Shopify", kind: "equity", previousClose: 112.35, sector: "Technology" },
  { symbol: "SQ", name: "Block", kind: "equity", previousClose: 78.92, sector: "Technology" },
  { symbol: "SNOW", name: "Snowflake", kind: "equity", previousClose: 172.65, sector: "Technology" },
  { symbol: "MU", name: "Micron Technology", kind: "equity", previousClose: 98.44, sector: "Technology" },
  { symbol: "AMAT", name: "Applied Materials", kind: "equity", previousClose: 178.32, sector: "Technology" },
  { symbol: "LRCX", name: "Lam Research", kind: "equity", previousClose: 78.55, sector: "Technology" },
  { symbol: "KLAC", name: "KLA Corporation", kind: "equity", previousClose: 712.44, sector: "Technology" },

  // Communication
  { symbol: "GOOGL", name: "Alphabet", kind: "equity", previousClose: 318.55, sector: "Communication" },
  { symbol: "META", name: "Meta Platforms", kind: "equity", previousClose: 648.22, sector: "Communication" },
  { symbol: "NFLX", name: "Netflix", kind: "equity", previousClose: 112.4, sector: "Communication" },
  { symbol: "DIS", name: "Walt Disney", kind: "equity", previousClose: 112.88, sector: "Communication" },
  { symbol: "CMCSA", name: "Comcast", kind: "equity", previousClose: 38.92, sector: "Communication" },
  { symbol: "T", name: "AT&T", kind: "equity", previousClose: 28.45, sector: "Communication" },
  { symbol: "VZ", name: "Verizon", kind: "equity", previousClose: 42.78, sector: "Communication" },
  { symbol: "SPOT", name: "Spotify", kind: "equity", previousClose: 612.33, sector: "Communication" },

  // Consumer Cyclical
  { symbol: "AMZN", name: "Amazon", kind: "equity", previousClose: 236.71, sector: "Consumer Cyclical" },
  { symbol: "TSLA", name: "Tesla", kind: "equity", previousClose: 421.05, sector: "Consumer Cyclical" },
  { symbol: "HD", name: "Home Depot", kind: "equity", previousClose: 412.33, sector: "Consumer Cyclical" },
  { symbol: "COST", name: "Costco", kind: "equity", previousClose: 1028.45, sector: "Consumer Cyclical" },
  { symbol: "UBER", name: "Uber", kind: "equity", previousClose: 82.45, sector: "Consumer Cyclical" },
  { symbol: "NKE", name: "Nike", kind: "equity", previousClose: 72.15, sector: "Consumer Cyclical" },
  { symbol: "SBUX", name: "Starbucks", kind: "equity", previousClose: 98.67, sector: "Consumer Cyclical" },
  { symbol: "LOW", name: "Lowe's", kind: "equity", previousClose: 258.44, sector: "Consumer Cyclical" },
  { symbol: "TJX", name: "TJX Companies", kind: "equity", previousClose: 122.78, sector: "Consumer Cyclical" },
  { symbol: "BKNG", name: "Booking Holdings", kind: "equity", previousClose: 4812.55, sector: "Consumer Cyclical" },
  { symbol: "MCD", name: "McDonald's", kind: "equity", previousClose: 298.33, sector: "Consumer Cyclical" },

  // Consumer Defensive
  { symbol: "WMT", name: "Walmart", kind: "equity", previousClose: 123.51, sector: "Consumer Defensive" },
  { symbol: "KO", name: "Coca-Cola", kind: "equity", previousClose: 63.82, sector: "Consumer Defensive" },
  { symbol: "PEP", name: "PepsiCo", kind: "equity", previousClose: 142.67, sector: "Consumer Defensive" },
  { symbol: "PG", name: "Procter & Gamble", kind: "equity", previousClose: 168.92, sector: "Consumer Defensive" },
  { symbol: "PM", name: "Philip Morris", kind: "equity", previousClose: 132.44, sector: "Consumer Defensive" },
  { symbol: "CL", name: "Colgate-Palmolive", kind: "equity", previousClose: 92.33, sector: "Consumer Defensive" },
  { symbol: "MDLZ", name: "Mondelez", kind: "equity", previousClose: 68.78, sector: "Consumer Defensive" },

  // Financials
  { symbol: "JPM", name: "JPMorgan Chase", kind: "equity", previousClose: 291.28, sector: "Financials" },
  { symbol: "V", name: "Visa", kind: "equity", previousClose: 413.59, sector: "Financials" },
  { symbol: "MA", name: "Mastercard", kind: "equity", previousClose: 570.33, sector: "Financials" },
  { symbol: "BAC", name: "Bank of America", kind: "equity", previousClose: 44.87, sector: "Financials" },
  { symbol: "GS", name: "Goldman Sachs", kind: "equity", previousClose: 612.55, sector: "Financials" },
  { symbol: "MS", name: "Morgan Stanley", kind: "equity", previousClose: 125.42, sector: "Financials" },
  { symbol: "WFC", name: "Wells Fargo", kind: "equity", previousClose: 74.68, sector: "Financials" },
  { symbol: "BRK.B", name: "Berkshire Hathaway", kind: "equity", previousClose: 520.12, sector: "Financials" },
  { symbol: "AXP", name: "American Express", kind: "equity", previousClose: 278.55, sector: "Financials" },
  { symbol: "SCHW", name: "Charles Schwab", kind: "equity", previousClose: 82.33, sector: "Financials" },
  { symbol: "C", name: "Citigroup", kind: "equity", previousClose: 72.44, sector: "Financials" },
  { symbol: "BLK", name: "BlackRock", kind: "equity", previousClose: 892.67, sector: "Financials" },
  { symbol: "PYPL", name: "PayPal", kind: "equity", previousClose: 78.92, sector: "Financials" },

  // Healthcare
  { symbol: "LLY", name: "Eli Lilly", kind: "equity", previousClose: 1417.54, sector: "Healthcare" },
  { symbol: "JNJ", name: "Johnson & Johnson", kind: "equity", previousClose: 148.25, sector: "Healthcare" },
  { symbol: "PFE", name: "Pfizer", kind: "equity", previousClose: 25.44, sector: "Healthcare" },
  { symbol: "ABBV", name: "AbbVie", kind: "equity", previousClose: 192.45, sector: "Healthcare" },
  { symbol: "UNH", name: "UnitedHealth", kind: "equity", previousClose: 542.78, sector: "Healthcare" },
  { symbol: "MRK", name: "Merck", kind: "equity", previousClose: 128.33, sector: "Healthcare" },
  { symbol: "TMO", name: "Thermo Fisher", kind: "equity", previousClose: 578.44, sector: "Healthcare" },
  { symbol: "ABT", name: "Abbott Labs", kind: "equity", previousClose: 118.92, sector: "Healthcare" },
  { symbol: "BMY", name: "Bristol-Myers Squibb", kind: "equity", previousClose: 52.67, sector: "Healthcare" },
  { symbol: "ISRG", name: "Intuitive Surgical", kind: "equity", previousClose: 528.33, sector: "Healthcare" },
  { symbol: "GILD", name: "Gilead Sciences", kind: "equity", previousClose: 98.44, sector: "Healthcare" },
  { symbol: "AMGN", name: "Amgen", kind: "equity", previousClose: 298.55, sector: "Healthcare" },

  // Energy
  { symbol: "XOM", name: "Exxon Mobil", kind: "equity", previousClose: 118.34, sector: "Energy" },
  { symbol: "CVX", name: "Chevron", kind: "equity", previousClose: 155.72, sector: "Energy" },
  { symbol: "COP", name: "ConocoPhillips", kind: "equity", previousClose: 108.44, sector: "Energy" },
  { symbol: "SLB", name: "Schlumberger", kind: "equity", previousClose: 42.78, sector: "Energy" },
  { symbol: "EOG", name: "EOG Resources", kind: "equity", previousClose: 128.33, sector: "Energy" },

  // Industrials
  { symbol: "CAT", name: "Caterpillar", kind: "equity", previousClose: 384.15, sector: "Industrials" },
  { symbol: "BA", name: "Boeing", kind: "equity", previousClose: 175.38, sector: "Industrials" },
  { symbol: "RTX", name: "RTX Corporation", kind: "equity", previousClose: 128.44, sector: "Industrials" },
  { symbol: "HON", name: "Honeywell", kind: "equity", previousClose: 218.33, sector: "Industrials" },
  { symbol: "UPS", name: "United Parcel Service", kind: "equity", previousClose: 142.78, sector: "Industrials" },
  { symbol: "GE", name: "GE Aerospace", kind: "equity", previousClose: 198.92, sector: "Industrials" },
  { symbol: "LMT", name: "Lockheed Martin", kind: "equity", previousClose: 468.55, sector: "Industrials" },
  { symbol: "DE", name: "John Deere", kind: "equity", previousClose: 412.67, sector: "Industrials" },
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
