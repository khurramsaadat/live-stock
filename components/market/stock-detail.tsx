"use client";

import { formatChange, formatPercent, formatPrice } from "@/lib/market/format";
import type { Quote } from "@/lib/market/types";
import { changeTone } from "./tone";
import { Sparkline } from "./sparkline";

interface StockDetailProps {
  quote: Quote;
  onClose: () => void;
}

export function StockDetail({ quote, onClose }: StockDetailProps) {
  const tone = changeTone(quote.change);
  const values = quote.history.length >= 2
    ? quote.history
    : [quote.previousClose, quote.price];

  const high = Math.max(...values);
  const low = Math.min(...values);
  const range = high - low || 1;
  const position = ((quote.price - low) / range) * 100;

  return (
    <div className="rounded-card border border-border bg-panel">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="tabular text-lg font-medium">{quote.symbol}</span>
          <span className="text-sm text-ink-muted">{quote.name}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex size-7 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-panel-raised hover:text-ink"
          aria-label="Close detail"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="p-5">
        {/* Price header */}
        <div className="flex items-baseline gap-3">
          <span className="tabular text-3xl font-medium tracking-tight">
            {formatPrice(quote.price)}
          </span>
          <span className={`tabular text-sm font-medium ${tone}`}>
            {formatChange(quote.change)} ({formatPercent(quote.changePercent)})
          </span>
        </div>

        {/* Sparkline */}
        <div className="mt-5">
          <Sparkline
            values={values}
            width={400}
            height={80}
            className={tone}
          />
        </div>

        {/* Day range */}
        <div className="mt-5">
          <p className="eyebrow">Day range</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="tabular text-[0.75rem] text-loss">{formatPrice(low)}</span>
            <div className="relative flex-1 h-1.5 rounded-full bg-panel-raised">
              <div
                className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-loss to-gain"
                style={{ width: "100%" }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 size-3 rounded-full bg-ink border-2 border-ground"
                style={{ left: `${Math.min(100, Math.max(0, position))}%` }}
              />
            </div>
            <span className="tabular text-[0.75rem] text-gain">{formatPrice(high)}</span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          {[
            { label: "Previous close", value: formatPrice(quote.previousClose) },
            { label: "Change", value: formatChange(quote.change), className: tone },
            { label: "Change %", value: formatPercent(quote.changePercent), className: tone },
            { label: "Data points", value: quote.history.length.toString() },
          ].map(({ label, value, className }) => (
            <div key={label} className="rounded-sm border border-border bg-panel-sunken px-3 py-2">
              <p className="eyebrow">{label}</p>
              <p className={`tabular mt-1 text-sm font-medium ${className ?? ""}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Market status */}
        <div className="mt-4 flex items-center gap-2">
          {quote.updatedAt !== null ? (
            <>
              <span className="size-1.5 rounded-full bg-gain" />
              <span className="text-[0.72rem] text-ink-muted">Live data</span>
            </>
          ) : (
            <>
              <span className="size-1.5 rounded-full bg-ink-muted" />
              <span className="text-[0.72rem] text-ink-muted">Last close data</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
