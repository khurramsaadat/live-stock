import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_WATCHLIST } from "@/lib/market/universe";
import { useWatchlist } from "@/lib/market/use-watchlist";

let keyCounter = 0;
let storageKey: string;

beforeEach(() => {
  window.localStorage.clear();
  keyCounter += 1;
  storageKey = `test.watchlist.${keyCounter}`;
});

function stored(key: string): unknown {
  const raw = window.localStorage.getItem(key);
  return raw === null ? null : JSON.parse(raw);
}

describe("useWatchlist", () => {
  it("starts from the default list", () => {
    const { result } = renderHook(() => useWatchlist(storageKey));
    expect(result.current.symbols).toEqual(DEFAULT_WATCHLIST);
    expect(result.current.available.length).toBeGreaterThan(0);
  });

  it("adds a known symbol and persists it", () => {
    const { result } = renderHook(() => useWatchlist(storageKey));
    let added = false;

    act(() => {
      added = result.current.add("TSLA");
    });

    expect(added).toBe(true);
    expect(result.current.symbols).toContain("TSLA");
    expect(stored(storageKey)).toEqual(result.current.symbols);
  });

  it("normalises case and whitespace", () => {
    const { result } = renderHook(() => useWatchlist(storageKey));

    act(() => {
      result.current.add("  tsla  ");
    });

    expect(result.current.symbols).toContain("TSLA");
  });

  it("rejects duplicates and unknown symbols", () => {
    const { result } = renderHook(() => useWatchlist(storageKey));
    const duplicate = DEFAULT_WATCHLIST[0];
    let duplicateResult = true;
    let unknownResult = true;

    act(() => {
      duplicateResult = result.current.add(duplicate);
      unknownResult = result.current.add("ZZZZ");
    });

    expect(duplicateResult).toBe(false);
    expect(unknownResult).toBe(false);
    expect(result.current.symbols.filter((entry) => entry === duplicate)).toHaveLength(1);
  });

  it("removes a symbol", () => {
    const { result } = renderHook(() => useWatchlist(storageKey));
    const target = DEFAULT_WATCHLIST[0];

    act(() => {
      result.current.remove(target);
    });

    expect(result.current.symbols).not.toContain(target);
    expect(stored(storageKey)).toEqual(result.current.symbols);
  });

  it("resets to the default list", () => {
    const { result } = renderHook(() => useWatchlist(storageKey));

    act(() => {
      result.current.remove(DEFAULT_WATCHLIST[0]);
    });
    act(() => {
      result.current.reset();
    });

    expect(result.current.symbols).toEqual(DEFAULT_WATCHLIST);
  });

  it("keeps two consumers in sync", () => {
    const first = renderHook(() => useWatchlist(storageKey));
    const second = renderHook(() => useWatchlist(storageKey));

    act(() => {
      first.result.current.add("XOM");
    });

    expect(second.result.current.symbols).toContain("XOM");
  });

  it("ignores a corrupt stored value", () => {
    window.localStorage.setItem(storageKey, "{not json");
    const { result } = renderHook(() => useWatchlist(storageKey));
    expect(result.current.symbols).toEqual(DEFAULT_WATCHLIST);
  });
});
