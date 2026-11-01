import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createMockFeed } from "@/lib/market/mock-feed";
import type { FeedStatus, FeedUpdate, MarketSymbol } from "@/lib/market/types";

const symbols: MarketSymbol[] = [
  { symbol: "AAA", name: "Alpha", kind: "equity", previousClose: 100 },
  { symbol: "BBB", name: "Beta", kind: "equity", previousClose: 250 },
];

function collect(seed: number, ticks: number) {
  const updates: FeedUpdate[] = [];
  const statuses: FeedStatus[] = [];
  const feed = createMockFeed(symbols, { seed, intervalMs: 1000 });

  const disconnect = feed.connect({
    onUpdate: (update) => updates.push(update),
    onStatus: (status) => statuses.push(status),
  });

  vi.advanceTimersByTime(1000 * ticks);

  return { updates, statuses, disconnect };
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("createMockFeed", () => {
  it("reports a live stream after the first tick", () => {
    const { statuses, disconnect } = collect(1, 0);
    expect(statuses[0]).toBe("connecting");
    expect(statuses).toContain("live");
    disconnect();
  });

  it("emits one update per symbol per tick", () => {
    const { updates, disconnect } = collect(1, 3);
    // One immediate tick at connect, then three interval ticks.
    expect(updates).toHaveLength(8);
    expect(new Set(updates.map((update) => update.symbol))).toEqual(new Set(["AAA", "BBB"]));
    disconnect();
  });

  it("is reproducible for a fixed seed", () => {
    const first = collect(7, 3);
    first.disconnect();
    const second = collect(7, 3);
    second.disconnect();

    expect(first.updates.map((update) => update.price)).toEqual(
      second.updates.map((update) => update.price),
    );
  });

  it("produces a different walk for a different seed", () => {
    const first = collect(7, 3);
    first.disconnect();
    const second = collect(99, 3);
    second.disconnect();

    expect(first.updates.map((update) => update.price)).not.toEqual(
      second.updates.map((update) => update.price),
    );
  });

  it("stops emitting after the unsubscribe function runs", () => {
    const { updates, disconnect } = collect(3, 0);
    const count = updates.length;
    disconnect();
    vi.advanceTimersByTime(5000);
    expect(updates).toHaveLength(count);
  });
});
