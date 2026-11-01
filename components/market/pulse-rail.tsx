import { formatClock, formatPercent } from "@/lib/market/format";
import type { FeedStatus, Quote } from "@/lib/market/types";
import { changeTone } from "./tone";

interface PulseRailProps {
  quotes: Quote[];
  feedKind: string;
  status: FeedStatus;
  detail?: string;
  lastUpdated: number | null;
  className?: string;
}

const statusCopy: Record<FeedStatus, string> = {
  idle: "Standing by",
  connecting: "Opening the stream",
  live: "Streaming",
  stalled: "Reconnecting",
  error: "Stream down",
};

function MoveRow({ quote }: { quote: Quote }) {
  return (
    <li className="flex items-baseline justify-between gap-3">
      <span className="tabular text-[0.78rem] tracking-wide">{quote.symbol}</span>
      <span className={`tabular text-[0.78rem] font-medium ${changeTone(quote.change)}`}>
        {formatPercent(quote.changePercent)}
      </span>
    </li>
  );
}

export function PulseRail({
  quotes,
  feedKind,
  status,
  detail,
  lastUpdated,
  className = "",
}: PulseRailProps) {
  const advancing = quotes.filter((q) => q.change > 0).length;
  const declining = quotes.filter((q) => q.change < 0).length;
  const flat = quotes.length - advancing - declining;
  const total = Math.max(1, advancing + declining + flat);

  return (
    <aside
      className={`rounded-card border border-border bg-panel p-5 ${className}`}
      aria-labelledby="pulse-heading"
      style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
    >
      <h2 id="pulse-heading" className="font-serif text-lg italic">Market pulse</h2>

      <div className="mt-5">
        <p className="eyebrow">Breadth</p>
        <div className="mt-3 flex h-1.5 w-full overflow-hidden rounded-full" data-testid="breadth-bar">
          <span className="bg-gain" style={{ width: `${(advancing / total) * 100}%` }} />
          <span className="bg-ink-muted/30" style={{ width: `${(flat / total) * 100}%` }} />
          <span className="bg-loss" style={{ width: `${(declining / total) * 100}%` }} />
        </div>
        <p className="tabular mt-2 text-3xs text-ink-muted">
          {advancing} up - {declining} down{flat > 0 ? ` - ${flat} flat` : ""}
        </p>
      </div>

      <div className="mt-6 border-t border-border pt-4">
        <p className="eyebrow">Stream</p>
        <p className="mt-2 text-[0.78rem] text-ink-secondary">
          {statusCopy[status]}
          {detail ? <span className="text-ink-muted"> ({detail})</span> : null}
        </p>
        <dl className="tabular mt-2 space-y-1 text-3xs text-ink-muted">
          <div className="flex justify-between gap-3">
            <dt>Adapter</dt>
            <dd className="text-ink-secondary">{feedKind}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Last print</dt>
            <dd className="text-ink-secondary">{formatClock(lastUpdated)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 border-t border-border pt-4">
        <p className="eyebrow">Legend</p>
        <ul className="mt-3 space-y-2 text-3xs text-ink-secondary">
          <li className="flex items-center gap-2">
            <span aria-hidden className="size-[5px] rounded-full bg-gain" />
            Advancing
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden className="size-[5px] rounded-full bg-loss" />
            Declining
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden className="size-[5px] rounded-full bg-accent" />
            System state
          </li>
        </ul>
      </div>
    </aside>
  );
}
