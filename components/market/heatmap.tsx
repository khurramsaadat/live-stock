"use client";

import { useMemo, useState } from "react";
import { formatPercent, formatPrice } from "@/lib/market/format";
import type { Quote } from "@/lib/market/types";
import { WATCHLIST_UNIVERSE, type Sector } from "@/lib/market/universe";
import { getLogoSrc } from "./stock-icon";

interface HeatmapProps {
  quotes: Quote[];
  onSymbolClick?: (symbol: string) => void;
}

function heatColor(changePercent: number): string {
  if (changePercent > 3) return "#00C805";
  if (changePercent > 1.5) return "#00A004";
  if (changePercent > 0.5) return "#007803";
  if (changePercent > 0) return "#2A5A1C";
  if (changePercent === 0) return "#404040";
  if (changePercent > -0.5) return "#8B3A2A";
  if (changePercent > -1.5) return "#A84428";
  if (changePercent > -3) return "#CC4400";
  return "#FF5000";
}

const SECTOR_COLORS: Record<Sector, string> = {
  Technology: "#3B82F6",
  Financials: "#8B5CF6",
  Healthcare: "#06B6D4",
  "Consumer Cyclical": "#F59E0B",
  "Consumer Defensive": "#10B981",
  Energy: "#EF4444",
  Industrials: "#6366F1",
  Communication: "#EC4899",
  "Real Estate": "#14B8A6",
  Utilities: "#84CC16",
  Materials: "#F97316",
};

interface TreemapRect {
  quote: Quote;
  x: number;
  y: number;
  w: number;
  h: number;
}

function squarify(
  quotes: Quote[],
  width: number,
  height: number,
): TreemapRect[] {
  if (quotes.length === 0) return [];

  const totalValue = quotes.reduce((sum, q) => sum + q.previousClose, 0);
  if (totalValue === 0) return [];

  const sorted = [...quotes].sort((a, b) => b.previousClose - a.previousClose);

  const rects: TreemapRect[] = [];
  let x = 0;
  let y = 0;
  let remainingW = width;
  let remainingH = height;
  let remaining = sorted.map((q) => ({
    quote: q,
    area: (q.previousClose / totalValue) * width * height,
  }));

  while (remaining.length > 0) {
    const isHorizontal = remainingW >= remainingH;
    const sideLength = isHorizontal ? remainingH : remainingW;

    let row: typeof remaining = [];
    let rowArea = 0;
    let bestAspect = Infinity;

    for (const item of remaining) {
      const testRow = [...row, item];
      const testArea = rowArea + item.area;
      const rowLength = testArea / sideLength;

      let worstAspect = 0;
      for (const r of testRow) {
        const rLen = r.area / rowLength;
        const aspect = Math.max(rowLength / rLen, rLen / rowLength);
        worstAspect = Math.max(worstAspect, aspect);
      }

      if (worstAspect <= bestAspect || row.length === 0) {
        row = testRow;
        rowArea = testArea;
        bestAspect = worstAspect;
      } else {
        break;
      }
    }

    const rowLength = Math.min(
      rowArea / sideLength,
      isHorizontal ? remainingW : remainingH,
    );

    let offset = 0;
    for (const item of row) {
      const itemLength = item.area / rowLength;

      if (isHorizontal) {
        rects.push({
          quote: item.quote,
          x,
          y: y + offset,
          w: rowLength,
          h: itemLength,
        });
        offset += itemLength;
      } else {
        rects.push({
          quote: item.quote,
          x: x + offset,
          y,
          w: itemLength,
          h: rowLength,
        });
        offset += itemLength;
      }
    }

    if (isHorizontal) {
      x += rowLength;
      remainingW -= rowLength;
    } else {
      y += rowLength;
      remainingH -= rowLength;
    }

    const usedSymbols = new Set(row.map((r) => r.quote.symbol));
    remaining = remaining.filter((r) => !usedSymbols.has(r.quote.symbol));
  }

  return rects;
}

function getSectorForSymbol(symbol: string): Sector | null {
  const entry = WATCHLIST_UNIVERSE.find((s) => s.symbol === symbol);
  return entry?.sector ?? null;
}

export function Heatmap({ quotes, onSymbolClick }: HeatmapProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeSectors, setActiveSectors] = useState<Set<Sector>>(new Set());

  const WIDTH = 960;
  const HEIGHT = 560;

  const sectorStats = useMemo(() => {
    const map = new Map<Sector, { count: number; totalChange: number }>();
    for (const q of quotes) {
      const sector = getSectorForSymbol(q.symbol);
      if (!sector) continue;
      const existing = map.get(sector) ?? { count: 0, totalChange: 0 };
      existing.count += 1;
      existing.totalChange += q.changePercent;
      map.set(sector, existing);
    }
    return map;
  }, [quotes]);

  const filteredQuotes = useMemo(() => {
    if (activeSectors.size === 0) return quotes;
    return quotes.filter((q) => {
      const sector = getSectorForSymbol(q.symbol);
      return sector !== null && activeSectors.has(sector);
    });
  }, [quotes, activeSectors]);

  const toggleSector = (sector: Sector) => {
    setActiveSectors((prev) => {
      const next = new Set(prev);
      if (next.has(sector)) {
        next.delete(sector);
      } else {
        next.add(sector);
      }
      return next;
    });
  };

  const rects = useMemo(() => squarify(filteredQuotes, WIDTH, HEIGHT), [filteredQuotes]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="heading-lg text-ink">Performance Heatmap</h1>
          <p className="mt-1 text-[0.78rem] text-ink-muted">
            {activeSectors.size > 0
              ? `${filteredQuotes.length} of ${quotes.length} stocks - filtered by ${activeSectors.size} sector${activeSectors.size > 1 ? "s" : ""}`
              : `${quotes.length} stocks - click a sector below to filter`}
          </p>
        </div>
        {activeSectors.size > 0 && (
          <button
            type="button"
            onClick={() => setActiveSectors(new Set())}
            className="flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-[0.72rem] font-medium text-ink-muted transition-colors hover:border-border-strong hover:text-ink"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Clear filters
          </button>
        )}
      </div>

      {/* Sector filters */}
      <div className="mt-4 flex flex-wrap gap-2">
        {Array.from(sectorStats.entries())
          .sort((a, b) => b[1].count - a[1].count)
          .map(([sector, stats]) => {
            const avgChange = stats.totalChange / stats.count;
            const isActive = activeSectors.has(sector);
            const isFiltering = activeSectors.size > 0;
            return (
              <button
                key={sector}
                type="button"
                onClick={() => toggleSector(sector)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.68rem] transition-all duration-150 ${
                  isActive
                    ? "border-accent/40 bg-accent/15 shadow-sm"
                    : isFiltering
                      ? "border-border/50 bg-panel opacity-50 hover:opacity-80"
                      : "border-border bg-panel hover:border-border-strong"
                }`}
              >
                <span
                  className="size-2 rounded-full transition-transform duration-150"
                  style={{
                    backgroundColor: SECTOR_COLORS[sector],
                    transform: isActive ? "scale(1.3)" : "scale(1)",
                  }}
                />
                <span className={`font-medium ${isActive ? "text-ink" : "text-ink-muted"}`}>{sector}</span>
                <span className="text-[0.62rem] text-ink-muted">{stats.count}</span>
                <span className={`tabular font-semibold ${avgChange >= 0 ? "text-gain" : "text-loss"}`}>
                  {avgChange >= 0 ? "+" : ""}{avgChange.toFixed(2)}%
                </span>
              </button>
            );
          })}
      </div>

      <div className="mt-4 overflow-hidden rounded-card border border-border">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full"
          style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
        >
          {rects.map((rect) => {
            const isHovered = hovered === rect.quote.symbol;
            const showLabel = rect.w > 30 && rect.h > 22;
            const showPrice = rect.w > 48 && rect.h > 38;
            const showLogo = rect.w > 56 && rect.h > 46;
            const logoSrc = getLogoSrc(rect.quote.symbol);
            const logoSize = Math.min(rect.w * 0.26, rect.h * 0.26, 32);
            const isLargeTile = rect.w > 80 && rect.h > 60;
            const sector = getSectorForSymbol(rect.quote.symbol);

            return (
              <g
                key={rect.quote.symbol}
                onMouseEnter={() => setHovered(rect.quote.symbol)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onSymbolClick?.(rect.quote.symbol)}
                className="cursor-pointer"
              >
                <rect
                  x={rect.x + 1}
                  y={rect.y + 1}
                  width={Math.max(0, rect.w - 2)}
                  height={Math.max(0, rect.h - 2)}
                  rx={3}
                  fill={heatColor(rect.quote.changePercent)}
                  opacity={isHovered ? 1 : 0.88}
                  className="transition-all duration-150"
                  stroke={isHovered ? "var(--color-accent)" : "var(--color-border)"}
                  strokeWidth={isHovered ? 2 : 0.5}
                />

                {/* Sector indicator dot */}
                {sector && rect.w > 40 && rect.h > 30 && (
                  <rect
                    x={rect.x + 4}
                    y={rect.y + 4}
                    width={8}
                    height={3}
                    rx={1.5}
                    fill={SECTOR_COLORS[sector]}
                    opacity={0.85}
                  />
                )}

                {showLogo && logoSrc && (
                  <image
                    href={logoSrc}
                    x={rect.x + rect.w / 2 - logoSize / 2}
                    y={rect.y + (isLargeTile ? rect.h * 0.15 : rect.h * 0.1)}
                    width={logoSize}
                    height={logoSize}
                    style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}
                  />
                )}

                {showLabel && (
                  <>
                    <text
                      x={rect.x + rect.w / 2}
                      y={
                        showLogo && logoSrc
                          ? rect.y + (isLargeTile ? rect.h * 0.56 : rect.h * 0.52)
                          : rect.y + rect.h / 2 - (showPrice ? 5 : 0)
                      }
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="white"
                      fontSize={rect.w > 80 ? 12 : rect.w > 50 ? 10 : 8}
                      fontWeight="700"
                      fontFamily="var(--font-heading)"
                    >
                      {rect.quote.symbol}
                    </text>
                    {showPrice && (
                      <text
                        x={rect.x + rect.w / 2}
                        y={
                          showLogo && logoSrc
                            ? rect.y + (isLargeTile ? rect.h * 0.72 : rect.h * 0.7)
                            : rect.y + rect.h / 2 + 11
                        }
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="rgba(255,255,255,0.85)"
                        fontSize={rect.w > 80 ? 10 : 8}
                        fontWeight="600"
                        fontFamily="var(--font-mono)"
                      >
                        {formatPercent(rect.quote.changePercent)}
                      </text>
                    )}
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Color legend */}
      <div className="mt-3 flex items-center justify-center gap-1">
        {[
          { color: "#FF5000", label: "-3%+" },
          { color: "#CC4400", label: "-3%" },
          { color: "#A84428", label: "-1.5%" },
          { color: "#8B3A2A", label: "-0.5%" },
          { color: "#404040", label: "0%" },
          { color: "#2A5A1C", label: "+0.5%" },
          { color: "#007803", label: "+1.5%" },
          { color: "#00A004", label: "+3%" },
          { color: "#00C805", label: "+3%+" },
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-0.5">
            <div
              className="h-2.5 w-8 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[0.55rem] text-ink-muted">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {hovered && (() => {
        const q = quotes.find((q) => q.symbol === hovered);
        if (!q) return null;
        const sector = getSectorForSymbol(q.symbol);
        return (
          <div className="mt-3 inline-flex items-center gap-3 rounded-full border border-border bg-panel px-4 py-2">
            {sector && (
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: SECTOR_COLORS[sector] }}
              />
            )}
            <span className="tabular text-sm font-medium">{q.symbol}</span>
            <span className="text-[0.78rem] text-ink-muted">{q.name}</span>
            {sector && <span className="text-[0.68rem] text-ink-muted">({sector})</span>}
            <span className="tabular text-sm">{formatPrice(q.price)}</span>
            <span className={`tabular text-sm font-medium ${q.change >= 0 ? "text-gain" : "text-loss"}`}>
              {formatPercent(q.changePercent)}
            </span>
          </div>
        );
      })()}
    </div>
  );
}
