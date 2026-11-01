import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { INDICES } from "@/lib/market/universe";
import { useMarketFeed } from "@/lib/market/use-market-feed";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useMarketFeed", () => {
  it("starts from the previous close and reports a live mock feed", () => {
    const { result } = renderHook(() => useMarketFeed([INDICES[0]]));

    expect(result.current.quotes).toHaveLength(1);
    expect(result.current.quotes[0].previousClose).toBe(INDICES[0].previousClose);
    expect(result.current.feedKind).toBe("mock");
    expect(result.current.status).toBe("live");
  });

  it("collects history as ticks arrive", () => {
    const { result } = renderHook(() => useMarketFeed([INDICES[0]]));
    const initial = result.current.quotes[0].history.length;

    act(() => {
      vi.advanceTimersByTime(1300);
    });

    expect(result.current.quotes[0].history.length).toBeGreaterThan(initial);
    expect(result.current.quotes[0].updatedAt).not.toBeNull();
    expect(result.current.lastUpdated).toBeGreaterThan(0);
  });

  it("keeps change and percent consistent with the previous close", () => {
    const { result } = renderHook(() => useMarketFeed([INDICES[0]]));

    act(() => {
      vi.advanceTimersByTime(2500);
    });

    const quote = result.current.quotes[0];
    expect(quote.change).toBeCloseTo(quote.price - quote.previousClose, 6);
    expect(quote.changePercent).toBeCloseTo((quote.change / quote.previousClose) * 100, 6);
  });

  it("tracks several symbols and finds the latest print", () => {
    const symbols = INDICES.slice(0, 3);
    const { result } = renderHook(() => useMarketFeed(symbols));

    act(() => {
      vi.advanceTimersByTime(1300);
    });

    expect(result.current.quotes).toHaveLength(3);
    const stamps = result.current.quotes.map((quote) => quote.updatedAt ?? 0);
    expect(result.current.lastUpdated).toBe(Math.max(...stamps));
  });
});
