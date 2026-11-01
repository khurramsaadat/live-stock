"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  previousClose: Record<string, number>;
}

const emptyState: FeedState = {
  prices: {},
  history: {},
  updatedAt: {},
  previousClose: {},
};

const CACHE_KEY = "ls-market-cache.v1";

interface CachedData {
  prices: Record<string, number>;
  previousClose: Record<string, number>;
  history: Record<string, number[]>;
  updatedAt: Record<string, number | null>;
  savedAt: number;
}

function loadCache(): Partial<FeedState> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    const cached: CachedData = JSON.parse(raw);
    const age = Date.now() - (cached.savedAt ?? 0);
    if (age > 24 * 60 * 60 * 1000) return {};
    return {
      prices: cached.prices ?? {},
      previousClose: cached.previousClose ?? {},
      history: cached.history ?? {},
      updatedAt: cached.updatedAt ?? {},
    };
  } catch {
    return {};
  }
}

function saveCache(state: FeedState) {
  try {
    const data: CachedData = {
      prices: state.prices,
      previousClose: state.previousClose,
      history: state.history,
      updatedAt: state.updatedAt,
      savedAt: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {}
}

/**
 * Connects one feed for the requested symbols and turns incremental price
 * updates into render-ready quotes. Caches the last known state in
 * localStorage so charts and data are available immediately on reload,
 * even when the market is closed.
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
  const cacheLoaded = useRef(false);

  useEffect(() => {
    if (cacheLoaded.current) return;
    cacheLoaded.current = true;
    const cached = loadCache();
    if (Object.keys(cached.prices ?? {}).length > 0) {
      setState((prev) => ({
        prices: { ...cached.prices, ...prev.prices },
        history: { ...cached.history, ...prev.history },
        updatedAt: { ...cached.updatedAt, ...prev.updatedAt },
        previousClose: { ...cached.previousClose, ...prev.previousClose },
      }));
    }
  }, []);
  const [status, setStatus] = useState<FeedStatus>("idle");
  const [detail, setDetail] = useState<string | undefined>(undefined);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceSave = useCallback((s: FeedState) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveCache(s), 2000);
  }, []);

  useEffect(() => {
    if (!feed) return;

    const disconnect = feed.connect({
      onUpdate: (update) => {
        setState((previous) => {
          const history = previous.history[update.symbol] ?? [];
          const nextHistory = [...history, update.price].slice(-HISTORY_LENGTH);
          const nextState: FeedState = {
            prices: { ...previous.prices, [update.symbol]: update.price },
            history: { ...previous.history, [update.symbol]: nextHistory },
            updatedAt: { ...previous.updatedAt, [update.symbol]: update.at },
            previousClose: previous.previousClose ?? {},
          };
          if (update.previousClose !== undefined) {
            nextState.previousClose = {
              ...(previous.previousClose ?? {}),
              [update.symbol]: update.previousClose,
            };
          }
          debounceSave(nextState);
          return nextState;
        });
      },
      onStatus: (nextStatus, nextDetail) => {
        setStatus(nextStatus);
        setDetail(nextDetail);
      },
    });

    return () => {
      disconnect();
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [feed, debounceSave]);

  const quotes = useMemo<Quote[]>(
    () =>
      symbols.map((entry) => {
        const price = state.prices[entry.symbol] ?? entry.previousClose;
        const prevClose = state.previousClose?.[entry.symbol] ?? entry.previousClose;
        const change = price - prevClose;
        return {
          symbol: entry.symbol,
          name: entry.name,
          kind: entry.kind,
          price,
          previousClose: prevClose,
          change,
          changePercent: prevClose === 0 ? 0 : (change / prevClose) * 100,
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
