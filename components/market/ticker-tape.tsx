"use client";

import { formatPercent, formatPrice } from "@/lib/market/format";
import type { Quote } from "@/lib/market/types";
import { changeTone } from "./tone";

interface TickerTapeProps {
  quotes: Quote[];
  onSymbolClick?: (symbol: string) => void;
}

function TapeItem({ quote, onClick }: { quote: Quote; onClick?: () => void }) {
  const tone = changeTone(quote.change);
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-1.5 whitespace-nowrap transition-colors hover:bg-panel-raised"
    >
      <span className="tabular text-[0.7rem] font-medium tracking-wide text-ink-secondary">
        {quote.symbol}
      </span>
      <span className="tabular text-[0.7rem] text-ink">
        {formatPrice(quote.price)}
      </span>
      <span className={`tabular text-[0.7rem] ${tone}`}>
        {formatPercent(quote.changePercent)}
      </span>
    </button>
  );
}

export function TickerTape({ quotes, onSymbolClick }: TickerTapeProps) {
  if (quotes.length === 0) return null;

  return (
    <div className="relative overflow-hidden border-b border-border bg-panel">
      <div
        className="ticker-scroll flex w-max"
        style={{ "--ticker-duration": `${Math.max(20, quotes.length * 3)}s` } as React.CSSProperties}
      >
        {quotes.map((q) => (
          <TapeItem key={`a-${q.symbol}`} quote={q} onClick={() => onSymbolClick?.(q.symbol)} />
        ))}
        {quotes.map((q) => (
          <TapeItem key={`b-${q.symbol}`} quote={q} onClick={() => onSymbolClick?.(q.symbol)} />
        ))}
      </div>
    </div>
  );
}
