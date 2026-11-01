"use client";

import { useState } from "react";
import { formatPercent, formatPrice } from "@/lib/market/format";
import type { Quote } from "@/lib/market/types";
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

export function Heatmap({ quotes, onSymbolClick }: HeatmapProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const WIDTH = 900;
  const HEIGHT = 500;
  const rects = squarify(quotes, WIDTH, HEIGHT);

  return (
    <div>
      <h1 className="heading-lg text-ink">Performance Heatmap</h1>
      <p className="mt-1 text-[0.78rem] text-ink-muted">
        Tile size represents relative weight. Color indicates daily change.
      </p>

      <div className="mt-5 overflow-hidden rounded-card border border-border">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full"
          style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
        >
          {rects.map((rect) => {
            const isHovered = hovered === rect.quote.symbol;
            const showLabel = rect.w > 35 && rect.h > 25;
            const showPrice = rect.w > 55 && rect.h > 40;
            const showLogo = rect.w > 60 && rect.h > 50;
            const logoSrc = getLogoSrc(rect.quote.symbol);
            const logoSize = Math.min(rect.w * 0.28, rect.h * 0.28, 36);
            const isLargeTile = rect.w > 100 && rect.h > 70;

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
                  rx={4}
                  fill={heatColor(rect.quote.changePercent)}
                  opacity={isHovered ? 1 : 0.9}
                  className="transition-all duration-150"
                  stroke={isHovered ? "var(--color-accent)" : "var(--color-border)"}
                  strokeWidth={isHovered ? 2 : 0.5}
                />

                {showLogo && logoSrc && (
                  <image
                    href={logoSrc}
                    x={rect.x + rect.w / 2 - logoSize / 2}
                    y={rect.y + (isLargeTile ? rect.h * 0.18 : rect.h * 0.12)}
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
                          ? rect.y + (isLargeTile ? rect.h * 0.58 : rect.h * 0.55)
                          : rect.y + rect.h / 2 - (showPrice ? 6 : 0)
                      }
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="white"
                      fontSize={rect.w > 100 ? 13 : 10}
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
                            ? rect.y + (isLargeTile ? rect.h * 0.72 : rect.h * 0.72)
                            : rect.y + rect.h / 2 + 12
                        }
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="rgba(255,255,255,0.85)"
                        fontSize={rect.w > 100 ? 11 : 9}
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
        return (
          <div className="mt-3 inline-flex items-center gap-4 rounded-full border border-border bg-panel px-4 py-2">
            <span className="tabular text-sm font-medium">{q.symbol}</span>
            <span className="text-[0.78rem] text-ink-muted">{q.name}</span>
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
