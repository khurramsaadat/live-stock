import { describe, expect, it } from "vitest";
import { formatChange, formatClock, formatPercent, formatPrice } from "@/lib/market/format";

describe("formatPrice", () => {
  it("groups thousands and always shows two decimals", () => {
    expect(formatPrice(6842.31)).toBe("6,842.31");
    expect(formatPrice(38)).toBe("38.00");
  });
});

describe("formatChange", () => {
  it("signs gains and losses", () => {
    expect(formatChange(12.86)).toBe("+12.86");
    expect(formatChange(-1.74)).toBe("-1.74");
  });

  it("leaves a flat move unsigned", () => {
    expect(formatChange(0)).toBe("0.00");
  });
});

describe("formatPercent", () => {
  it("rounds to two decimals with an explicit sign", () => {
    expect(formatPercent(0.1234)).toBe("+0.12%");
    expect(formatPercent(-1.5)).toBe("-1.50%");
    expect(formatPercent(0)).toBe("0.00%");
  });
});

describe("formatClock", () => {
  it("reports a waiting state before the first print", () => {
    expect(formatClock(null)).toBe("waiting");
  });

  it("renders a 24 hour clock", () => {
    expect(formatClock(Date.UTC(2026, 10, 2, 15, 4, 5))).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });
});
