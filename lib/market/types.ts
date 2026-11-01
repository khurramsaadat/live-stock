export type FeedStatus = "idle" | "connecting" | "live" | "stalled" | "error";

export type SymbolKind = "index" | "equity";

export interface MarketSymbol {
  /** Wire symbol, for example "AAPL" or "^GSPC". */
  symbol: string;
  /** Display name shown in the interface. */
  name: string;
  kind: SymbolKind;
  /** Closing price of the previous session, the baseline for change. */
  previousClose: number;
}

/** One price movement pushed by a feed. Nothing else is required. */
export interface FeedUpdate {
  symbol: string;
  price: number;
  /** Epoch milliseconds. */
  at: number;
  /**
   * Previous close for the session, when the provider reports it. The quote
   * falls back to the baseline in the symbol universe otherwise.
   */
  previousClose?: number;
}

export interface FeedHandler {
  onUpdate: (update: FeedUpdate) => void;
  onStatus: (status: FeedStatus, detail?: string) => void;
}

/**
 * A feed is a subscription with a teardown. Implementations may be a mock
 * random walk, a WebSocket stream or an HTTP poller, the dashboard does not
 * care which one it receives.
 */
export interface MarketFeed {
  readonly kind: string;
  /** Returns the unsubscribe function. */
  connect: (handler: FeedHandler) => () => void;
}

/** What the dashboard renders for a single symbol. */
export interface Quote {
  symbol: string;
  name: string;
  kind: SymbolKind;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  /** Recent prices, oldest first, for sparklines. */
  history: number[];
  /** Epoch milliseconds of the last update. */
  updatedAt: number | null;
}

export const HISTORY_LENGTH = 60;
