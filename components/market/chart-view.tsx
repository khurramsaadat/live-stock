"use client";

import { useMemo, useRef, useState } from "react";
import { formatPrice, formatPercent, formatChange } from "@/lib/market/format";
import type { Quote } from "@/lib/market/types";
import { changeTone } from "./tone";

interface ChartViewProps {
  quotes: Quote[];
}

export function ChartView({ quotes }: ChartViewProps) {
  const [selectedSymbol, setSelectedSymbol] = useState<string>(
    quotes[0]?.symbol ?? "",
  );
  const [crosshair, setCrosshair] = useState<{ x: number; index: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const selected = quotes.find((q) => q.symbol === selectedSymbol) ?? quotes[0];
  const values = selected?.history ?? [];

  const WIDTH = 900;
  const HEIGHT = 400;
  const PADDING_X = 0;
  const PADDING_Y = 20;
  const chartW = WIDTH - PADDING_X * 2;
  const chartH = HEIGHT - PADDING_Y * 2;

  const { points, path, min, max, areaPath } = useMemo(() => {
    if (values.length < 2)
      return { points: [] as [number, number][], path: "", min: 0, max: 0, areaPath: "" };

    const mn = Math.min(...values);
    const mx = Math.max(...values);
    const span = mx - mn || 1;
    const step = chartW / (values.length - 1);

    const pts: [number, number][] = values.map((v, i) => [
      PADDING_X + i * step,
      PADDING_Y + chartH - ((v - mn) / span) * chartH,
    ]);

    const p = pts
      .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
      .join(" ");

    const lastPt = pts[pts.length - 1];
    const firstPt = pts[0];
    const area = `${p} L${lastPt[0].toFixed(1)} ${HEIGHT} L${firstPt[0].toFixed(1)} ${HEIGHT} Z`;

    return { points: pts, path: p, min: mn, max: mx, areaPath: area };
  }, [values, chartW, chartH]);

  const tone = selected ? changeTone(selected.change) : "";
  const strokeColor = selected
    ? selected.change >= 0
      ? "var(--color-gain)"
      : "var(--color-loss)"
    : "var(--color-ink-muted)";

  const fillGradientId = "chart-gradient";

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg || points.length === 0) return;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * WIDTH;
    const step = chartW / (values.length - 1);
    const index = Math.round(Math.max(0, Math.min(values.length - 1, (x - PADDING_X) / step)));
    setCrosshair({ x: PADDING_X + index * step, index });
  };

  const crosshairValue = crosshair !== null ? values[crosshair.index] : null;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-xl italic text-ink">Charts</h1>
          {selected && (
            <div className="mt-2 flex items-baseline gap-3">
              <span className="tabular text-3xl font-medium tracking-tight">
                {crosshairValue !== null && crosshairValue !== undefined
                  ? formatPrice(crosshairValue)
                  : formatPrice(selected.price)}
              </span>
              {crosshairValue === null && (
                <span className={`tabular text-sm font-medium ${tone}`}>
                  {formatChange(selected.change)} ({formatPercent(selected.changePercent)})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Symbol selector */}
        <div className="flex flex-wrap gap-1.5">
          {quotes.map((q) => (
            <button
              key={q.symbol}
              type="button"
              onClick={() => {
                setSelectedSymbol(q.symbol);
                setCrosshair(null);
              }}
              className={`rounded-full px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.1em] transition-all duration-150 ${
                selectedSymbol === q.symbol
                  ? "bg-accent text-ground font-medium"
                  : "border border-border text-ink-muted hover:border-ink-muted hover:text-ink"
              }`}
            >
              {q.symbol}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="mt-5 overflow-hidden rounded-card border border-border bg-panel">
        {values.length < 2 ? (
          <div className="flex items-center justify-center py-24">
            <p className="text-ink-muted text-sm">Waiting for price history...</p>
          </div>
        ) : (
          <svg
            ref={svgRef}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="w-full cursor-crosshair"
            style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setCrosshair(null)}
          >
            <defs>
              <linearGradient id={fillGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity={0.2} />
                <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0.25, 0.5, 0.75].map((frac) => {
              const y = PADDING_Y + chartH * (1 - frac);
              const price = min + (max - min) * frac;
              return (
                <g key={frac}>
                  <line
                    x1={PADDING_X}
                    y1={y}
                    x2={WIDTH - PADDING_X}
                    y2={y}
                    stroke="var(--color-border)"
                    strokeWidth={0.5}
                  />
                  <text
                    x={WIDTH - 4}
                    y={y - 4}
                    textAnchor="end"
                    fill="var(--color-ink-muted)"
                    fontSize={9}
                    fontFamily="var(--font-mono)"
                  >
                    {formatPrice(price)}
                  </text>
                </g>
              );
            })}

            {/* Area fill */}
            <path d={areaPath} fill={`url(#${fillGradientId})`} />

            {/* Price line */}
            <path
              d={path}
              fill="none"
              stroke={strokeColor}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              className="spark-path"
              vectorEffect="non-scaling-stroke"
            />

            {/* End dot */}
            {points.length > 0 && (
              <circle
                cx={points[points.length - 1][0]}
                cy={points[points.length - 1][1]}
                r={3}
                fill={strokeColor}
              />
            )}

            {/* Crosshair */}
            {crosshair !== null && (
              <>
                <line
                  x1={crosshair.x}
                  y1={PADDING_Y}
                  x2={crosshair.x}
                  y2={HEIGHT - PADDING_Y}
                  stroke="var(--color-ink-muted)"
                  strokeWidth={0.5}
                  strokeDasharray="3 3"
                />
                {crosshairValue !== null && crosshairValue !== undefined && (
                  <>
                    <circle
                      cx={crosshair.x}
                      cy={points[crosshair.index]?.[1] ?? 0}
                      r={4}
                      fill="var(--color-ground)"
                      stroke={strokeColor}
                      strokeWidth={2}
                    />
                    <rect
                      x={crosshair.x - 30}
                      y={HEIGHT - PADDING_Y + 2}
                      width={60}
                      height={16}
                      rx={3}
                      fill="var(--color-panel-raised)"
                    />
                    <text
                      x={crosshair.x}
                      y={HEIGHT - PADDING_Y + 12}
                      textAnchor="middle"
                      fill="var(--color-ink-secondary)"
                      fontSize={8}
                      fontFamily="var(--font-mono)"
                    >
                      {formatPrice(crosshairValue)}
                    </text>
                  </>
                )}
              </>
            )}
          </svg>
        )}
      </div>

      {/* Stats row */}
      {selected && selected.history.length >= 2 && (
        <div className="mt-3 flex flex-wrap gap-4">
          {[
            { label: "Open", value: formatPrice(selected.history[0]) },
            { label: "High", value: formatPrice(Math.max(...selected.history)) },
            { label: "Low", value: formatPrice(Math.min(...selected.history)) },
            { label: "Prev Close", value: formatPrice(selected.previousClose) },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-card border border-border bg-panel px-4 py-2.5">
              <p className="eyebrow">{label}</p>
              <p className="tabular mt-1 text-sm font-medium">{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
