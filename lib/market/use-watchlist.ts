"use client";

import { useCallback, useSyncExternalStore } from "react";
import { DEFAULT_WATCHLIST, WATCHLIST_UNIVERSE } from "./universe";

export const WATCHLIST_STORAGE_KEY = "live-stocks.watchlist.v1";

type Listener = () => void;

const listeners = new Map<string, Set<Listener>>();
const snapshotCache = new Map<string, { raw: string | null; value: string[] }>();
const memoryFallback = new Map<string, string[]>();

function isKnownSymbol(symbol: string): boolean {
  return WATCHLIST_UNIVERSE.some((entry) => entry.symbol === symbol);
}

function parseSymbols(raw: string | null): string[] {
  if (!raw) return DEFAULT_WATCHLIST;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_WATCHLIST;
    const cleaned = parsed
      .filter((value): value is string => typeof value === "string")
      .filter(isKnownSymbol);
    return cleaned.length > 0 ? cleaned : DEFAULT_WATCHLIST;
  } catch {
    return DEFAULT_WATCHLIST;
  }
}

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Snapshot identity matters, so the parsed list is cached against the raw
 * string. An unchanged string returns the exact same array reference.
 */
function readSnapshot(key: string): string[] {
  const raw = readRaw(key);
  const cached = snapshotCache.get(key);
  if (cached && cached.raw === raw) return cached.value;

  const value = raw === null && memoryFallback.has(key)
    ? memoryFallback.get(key)!
    : parseSymbols(raw);

  snapshotCache.set(key, { raw, value });
  return value;
}

function emit(key: string) {
  for (const listener of listeners.get(key) ?? []) listener();
}

function subscribe(key: string, listener: Listener) {
  const bucket = listeners.get(key) ?? new Set<Listener>();
  bucket.add(listener);
  listeners.set(key, bucket);
  return () => {
    bucket.delete(listener);
    if (bucket.size === 0) listeners.delete(key);
  };
}

function writeSymbols(key: string, next: string[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(next));
  } catch {
    memoryFallback.set(key, next);
  }
  snapshotCache.delete(key);
  emit(key);
}

/**
 * Watchlist state persisted in localStorage and shared across components.
 * The server snapshot is always the default list, so the static export and the
 * hydrated client render the same markup.
 */
export function useWatchlist(storageKey: string = WATCHLIST_STORAGE_KEY) {
  const symbols = useSyncExternalStore(
    useCallback((listener: Listener) => subscribe(storageKey, listener), [storageKey]),
    useCallback(() => readSnapshot(storageKey), [storageKey]),
    useCallback(() => DEFAULT_WATCHLIST, []),
  );

  const add = useCallback(
    (symbol: string) => {
      const normalized = symbol.trim().toUpperCase();
      if (!normalized || !isKnownSymbol(normalized)) return false;
      if (symbols.includes(normalized)) return false;
      writeSymbols(storageKey, [...symbols, normalized]);
      return true;
    },
    [symbols, storageKey],
  );

  const remove = useCallback(
    (symbol: string) => {
      writeSymbols(storageKey, symbols.filter((entry) => entry !== symbol));
    },
    [symbols, storageKey],
  );

  const reset = useCallback(() => {
    writeSymbols(storageKey, DEFAULT_WATCHLIST);
  }, [storageKey]);

  const available = WATCHLIST_UNIVERSE.filter((entry) => !symbols.includes(entry.symbol));

  return { symbols, add, remove, reset, available };
}
