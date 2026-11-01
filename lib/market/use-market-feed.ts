"use client";

import { useEffect, useMemo, useState } from "react";
import { createMarketFeed } from "./create-feed";
import { findSymbol } from "./universe";
import {
  HISTORY_LENGTH,
  type FeedStatus,
  type MarketSymbol,
  type Quote,
} from "./types";

interface FeedState {
  prices: Record<string, number>;
  history: Record<string, number[]>;
  updatedAt: Record<string, number | null>;
}

const emptyState: FeedState = { prices: {}, history: {}, updatedAt: {} };

/**
 * Connects one feed for the requested symbols and turns incremental price
 * updates into render ready quotes. The feed is rebuilt only when the symbol
 * set itself changes.
 */
export function useMarketFeed(symbols: MarketSymbol[]) {
  const symbolKey = symbols.map((entry) => entry.symbol).join(",");

  const requested = useMemo<MarketSymbol[]>(
    () =>
      symbolKey
        .split(",")
        .filter(Boolean)
        .map((symbol) => findSymbol(symbol))
        .filter((entry): entry is MarketSymbol => Boolean(entry)),
    [symbolKey],
  );

  const feed = useMemo(
    () => (requested.length > 0 ? createMarketFeed(requested) : null),
    [requested],
  );

  const [state, setState] = useState<FeedState>(emptyState);
  const [status, setStatus] = useState<FeedStatus>("idle");
  const [detail, setDetail] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!feed) return;

    const disconnect = feed.connect({
      onUpdate: (update) => {
        setState((previous) => {
          const history = previous.history[update.symbol] ?? [];
          const nextHistory = [...history, update.price].slice(-HISTORY_LENGTH);
          return {
            prices: { ...previous.prices, [update.symbol]: update.price },
            history: { ...previous.history, [update.symbol]: nextHistory },
            updatedAt: { ...previous.updatedAt, [update.symbol]: update.at },
          };
        });
      },
      onStatus: (nextStatus, nextDetail) => {
        setStatus(nextStatus);
        setDetail(nextDetail);
      },
    });

    return () => disconnect();
  }, [feed]);

  const quotes = useMemo<Quote[]>(
    () =>
      symbols.map((entry) => {
        const price = state.prices[entry.symbol] ?? entry.previousClose;
        const change = price - entry.previousClose;
        return {
          symbol: entry.symbol,
          name: entry.name,
          kind: entry.kind,
          price,
          previousClose: entry.previousClose,
          change,
          changePercent: entry.previousClose === 0 ? 0 : (change / entry.previousClose) * 100,
          history: state.history[entry.symbol] ?? [],
          updatedAt: state.updatedAt[entry.symbol] ?? null,
        };
      }),
    [symbols, state],
  );

  const lastUpdated = useMemo(() => {
    const stamps = Object.values(state.updatedAt).filter(
      (value): value is number => typeof value === "number",
    );
    return stamps.length > 0 ? Math.max(...stamps) : null;
  }, [state.updatedAt]);

  return { quotes, status, detail, feedKind: feed?.kind ?? "idle", lastUpdated };
}
