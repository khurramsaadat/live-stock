"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { formatPrice, formatPercent, formatChange } from "@/lib/market/format";
import type { Quote } from "@/lib/market/types";
import { changeTone } from "./tone";

interface ChartViewProps {
  quotes: Quote[];
  initialSymbol?: string | null;
}

type Period = "1D" | "5D" | "1M" | "ALL";

export function ChartView({ quotes, initialSymbol }: ChartViewProps) {
  const [selectedSymbol, setSelectedSymbol] = useState<string>(
    initialSymbol ?? quotes[0]?.symbol ?? "",
  );
  const [crosshair, setCrosshair] = useState<{ x: number; index: number } | null>(null);
  const [period, setPeriod] = useState<Period>("1D");
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (initialSymbol) setSelectedSymbol(initialSymbol);
  }, [initialSymbol]);

  const selected = quotes.find((q) => q.symbol === selectedSymbol) ?? quotes[0];

  const values = useMemo(() => {
    if (!selected) return [];
    const hist = selected.history;
    if (hist.length >= 2) return hist;
    const base = selected.previousClose;
    const price = selected.price;
    if (base === price) return [base, base * 1.001, base * 0.999, base];
    const steps = 12;
    const simulated: number[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const noise = (Math.sin(t * 7) * 0.002 + Math.cos(t * 3.7) * 0.001) * base;
      simulated.push(base + (price - base) * t + noise);
    }
    return simulated;
  }, [selected]);

  const periodValues = useMemo(() => {
    switch (period) {
      case "1D":
        return values;
      case "5D":
        return values;
      case "1M":
        return values;
      case "ALL":
        return values;
      default:
        return values;
    }
  }, [values, period]);

  const WIDTH = 900;
  const HEIGHT = 400;
  const PADDING_X = 60;
  const PADDING_Y = 30;
  const PADDING_BOTTOM = 30;
  const chartW = WIDTH - PADDING_X * 2;
  const chartH = HEIGHT - PADDING_Y - PADDING_BOTTOM;

  const { points, path, min, max, areaPath } = useMemo(() => {
    if (periodValues.length < 2)
      return { points: [] as [number, number][], path: "", min: 0, max: 0, areaPath: "" };

    const mn = Math.min(...periodValues);
    const mx = Math.max(...periodValues);
    const range = mx - mn || mn * 0.01 || 1;
    const padded_min = mn - range * 0.05;
    const padded_max = mx + range * 0.05;
    const span = padded_max - padded_min;
    const step = chartW / (periodValues.length - 1);

    const pts: [number, number][] = periodValues.map((v, i) => [
      PADDING_X + i * step,
      PADDING_Y + chartH - ((v - padded_min) / span) * chartH,
    ]);

    const p = pts
      .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
      .join(" ");

    const lastPt = pts[pts.length - 1];
    const firstPt = pts[0];
    const area = `${p} L${lastPt[0].toFixed(1)} ${PADDING_Y + chartH} L${firstPt[0].toFixed(1)} ${PADDING_Y + chartH} Z`;

    return { points: pts, path: p, min: padded_min, max: padded_max, areaPath: area };
  }, [periodValues, chartW, chartH]);

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
    const step = chartW / (periodValues.length - 1);
    const index = Math.round(
      Math.max(0, Math.min(periodValues.length - 1, (x - PADDING_X) / step)),
    );
    setCrosshair({ x: PADDING_X + index * step, index });
  };

  const crosshairValue = crosshair !== null ? periodValues[crosshair.index] : null;

  const gridLines = 5;

  const hasData = selected && (selected.history.length > 0 || selected.price !== selected.previousClose);
  const statValues = selected
    ? selected.history.length >= 2
      ? selected.history
      : periodValues
    : [];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-xl italic text-ink">
              {selected?.name ?? "Charts"}
            </h1>
            {selected && (
              <span className="eyebrow">{selected.symbol}</span>
            )}
          </div>
          {selected && (
            <div className="mt-2 flex items-baseline gap-3">
              <span className="tabular text-3xl font-medium tracking-tight text-ink">
                {crosshairValue !== null && crosshairValue !== undefined
                  ? formatPrice(crosshairValue)
                  : formatPrice(selected.price)}
              </span>
              {crosshairValue === null && (
                <span className={`tabular text-sm font-medium ${tone}`}>
                  {formatChange(selected.change)} ({formatPercent(selected.changePercent)})
                </span>
              )}
              {selected.updatedAt === null && hasData && (
                <span className="ml-1 rounded-full bg-panel-raised px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest text-ink-muted">
                  Last close
                </span>
              )}
            </div>
          )}
        </div>

        {/* Period selector */}
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {(["1D", "5D", "1M", "ALL"] as Period[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`rounded-full px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.1em] transition-all duration-150 ${
                  period === p
                    ? "bg-accent text-ground font-medium"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Symbol pills */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {quotes.map((q) => (
          <button
            key={q.symbol}
            type="button"
            onClick={() => {
              setSelectedSymbol(q.symbol);
              setCrosshair(null);
            }}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.1em] transition-all duration-150 ${
              selectedSymbol === q.symbol
                ? "bg-accent text-ground font-medium"
                : "border border-border text-ink-muted hover:border-ink-muted hover:text-ink"
            }`}
          >
            <span>{q.symbol}</span>
            {selectedSymbol !== q.symbol && (
              <span className={`text-[0.6rem] ${changeTone(q.change)}`}>
                {formatPercent(q.changePercent)}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="mt-4 overflow-hidden rounded-card border border-border bg-panel">
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
              <stop offset="0%" stopColor={strokeColor} stopOpacity={0.18} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={0.02} />
            </linearGradient>
          </defs>

          {/* Y-axis grid lines and labels */}
          {Array.from({ length: gridLines }, (_, i) => {
            const frac = i / (gridLines - 1);
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
                  strokeDasharray={i === 0 || i === gridLines - 1 ? "none" : "2 4"}
                  opacity={0.5}
                />
                <text
                  x={PADDING_X - 8}
                  y={y + 3}
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

          {/* Previous close line */}
          {selected && points.length > 0 && (() => {
            const prevY = PADDING_Y + chartH - ((selected.previousClose - min) / (max - min)) * chartH;
            return (
              <g>
                <line
                  x1={PADDING_X}
                  y1={prevY}
                  x2={WIDTH - PADDING_X}
                  y2={prevY}
                  stroke="var(--color-ink-muted)"
                  strokeWidth={0.5}
                  strokeDasharray="6 4"
                  opacity={0.4}
                />
                <text
                  x={WIDTH - PADDING_X + 5}
                  y={prevY + 3}
                  textAnchor="start"
                  fill="var(--color-ink-muted)"
                  fontSize={8}
                  fontFamily="var(--font-mono)"
                >
                  Prev
                </text>
              </g>
            );
          })()}

          {/* Area fill */}
          {areaPath && <path d={areaPath} fill={`url(#${fillGradientId})`} />}

          {/* Price line */}
          {path && (
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
          )}

          {/* End dot with pulse */}
          {points.length > 0 && (
            <>
              <circle
                cx={points[points.length - 1][0]}
                cy={points[points.length - 1][1]}
                r={6}
                fill={strokeColor}
                opacity={0.15}
                className="breathe"
              />
              <circle
                cx={points[points.length - 1][0]}
                cy={points[points.length - 1][1]}
                r={3}
                fill={strokeColor}
              />
            </>
          )}

          {/* Crosshair */}
          {crosshair !== null && points[crosshair.index] && (
            <>
              {/* Vertical line */}
              <line
                x1={crosshair.x}
                y1={PADDING_Y}
                x2={crosshair.x}
                y2={PADDING_Y + chartH}
                stroke="var(--color-ink-muted)"
                strokeWidth={0.5}
                strokeDasharray="3 3"
              />
              {/* Horizontal line */}
              <line
                x1={PADDING_X}
                y1={points[crosshair.index][1]}
                x2={WIDTH - PADDING_X}
                y2={points[crosshair.index][1]}
                stroke="var(--color-ink-muted)"
                strokeWidth={0.5}
                strokeDasharray="3 3"
              />
              {crosshairValue !== null && crosshairValue !== undefined && (
                <>
                  {/* Dot */}
                  <circle
                    cx={crosshair.x}
                    cy={points[crosshair.index][1]}
                    r={4.5}
                    fill="var(--color-ground)"
                    stroke={strokeColor}
                    strokeWidth={2}
                  />
                  {/* Price label on Y axis */}
                  <rect
                    x={0}
                    y={points[crosshair.index][1] - 9}
                    width={PADDING_X - 6}
                    height={18}
                    rx={3}
                    fill={strokeColor}
                  />
                  <text
                    x={PADDING_X / 2 - 3}
                    y={points[crosshair.index][1] + 3}
                    textAnchor="middle"
                    fill="var(--color-ground)"
                    fontSize={8}
                    fontFamily="var(--font-mono)"
                    fontWeight="600"
                  >
                    {formatPrice(crosshairValue)}
                  </text>
                  {/* Index label on X axis */}
                  <rect
                    x={crosshair.x - 18}
                    y={PADDING_Y + chartH + 4}
                    width={36}
                    height={16}
                    rx={3}
                    fill="var(--color-panel-raised)"
                  />
                  <text
                    x={crosshair.x}
                    y={PADDING_Y + chartH + 14}
                    textAnchor="middle"
                    fill="var(--color-ink-secondary)"
                    fontSize={8}
                    fontFamily="var(--font-mono)"
                  >
                    #{crosshair.index + 1}
                  </text>
                </>
              )}
            </>
          )}
        </svg>
      </div>

      {/* Stats row */}
      {selected && statValues.length >= 2 && (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {[
            { label: "Price", value: formatPrice(selected.price) },
            { label: "Change", value: formatChange(selected.change), tone: changeTone(selected.change) },
            { label: "Change %", value: formatPercent(selected.changePercent), tone: changeTone(selected.change) },
            { label: "High", value: formatPrice(Math.max(...statValues)) },
            { label: "Low", value: formatPrice(Math.min(...statValues)) },
            { label: "Prev Close", value: formatPrice(selected.previousClose) },
          ].map(({ label, value, tone: t }) => (
            <div key={label} className="rounded-card border border-border bg-panel px-4 py-2.5">
              <p className="eyebrow">{label}</p>
              <p className={`tabular mt-1 text-sm font-medium ${t ?? ""}`}>{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
