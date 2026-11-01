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
      <span className="tabular text-[0.78rem] tracking-[0.02em]">{quote.symbol}</span>
      <span className={`tabular text-[0.78rem] ${changeTone(quote.change)}`}>
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
  const advancing = quotes.filter((quote) => quote.change > 0).length;
  const declining = quotes.filter((quote) => quote.change < 0).length;
  const flat = quotes.length - advancing - declining;
  const total = Math.max(1, advancing + declining + flat);

  const ranked = [...quotes].sort((a, b) => b.changePercent - a.changePercent);
  const leaders = ranked.filter((quote) => quote.changePercent > 0).slice(0, 3);
  const laggards = ranked
    .filter((quote) => quote.changePercent < 0)
    .slice(-3)
    .reverse();

  return (
    <aside
      className={`border-t border-rule pt-7 lg:border-t-0 lg:border-l lg:pl-9 lg:pt-0 ${className}`}
      aria-labelledby="pulse-heading"
    >
      <h2 id="pulse-heading" className="font-serif text-xl italic">Market pulse</h2>

      <div className="mt-7">
        <p className="eyebrow">Breadth</p>
        <div className="mt-3 flex h-[6px] w-full overflow-hidden" data-testid="breadth-bar">
          <span
            className="bg-emerald"
            style={{ width: `${(advancing / total) * 100}%` }}
            aria-hidden
          />
          <span
            className="bg-ink-muted/40"
            style={{ width: `${(flat / total) * 100}%` }}
            aria-hidden
          />
          <span
            className="bg-rust"
            style={{ width: `${(declining / total) * 100}%` }}
            aria-hidden
          />
        </div>
        <p className="tabular mt-3 text-3xs text-ink-soft">
          {advancing} up · {declining} down
          {flat > 0 ? ` · ${flat} flat` : ""}
        </p>
      </div>

      <div className="mt-8 border-t border-rule pt-5">
        <p className="eyebrow">Leaders</p>
        {leaders.length > 0 ? (
          <ul className="mt-2 space-y-1.5" data-testid="leaders-list">
            {leaders.map((quote) => (
              <MoveRow key={quote.symbol} quote={quote} />
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-[0.75rem] text-ink-muted">No names in the green.</p>
        )}

        <p className="eyebrow mt-5">Laggards</p>
        {laggards.length > 0 ? (
          <ul className="mt-2 space-y-1.5" data-testid="laggards-list">
            {laggards.map((quote) => (
              <MoveRow key={quote.symbol} quote={quote} />
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-[0.75rem] text-ink-muted">No names in the red.</p>
        )}
      </div>

      <div className="mt-8 border-t border-rule pt-5">
        <p className="eyebrow">Stream</p>
        <p className="mt-2 text-[0.78rem] leading-relaxed text-ink-soft">
          {statusCopy[status]}
          {detail ? <span className="text-ink-muted"> ({detail})</span> : null}
        </p>
        <dl className="tabular mt-3 space-y-1.5 text-3xs text-ink-muted">
          <div className="flex justify-between gap-3">
            <dt>Adapter</dt>
            <dd className="text-ink-soft">{feedKind}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Last print</dt>
            <dd className="text-ink-soft">{formatClock(lastUpdated)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 border-t border-rule pt-5">
        <p className="eyebrow">Legend</p>
        <ul className="mt-3 space-y-2 text-3xs text-ink-soft">
          <li className="flex items-center gap-2.5">
            <span aria-hidden className="size-[5px] rounded-full bg-emerald" />
            Advancing
          </li>
          <li className="flex items-center gap-2.5">
            <span aria-hidden className="size-[5px] rounded-full bg-rust" />
            Declining
          </li>
          <li className="flex items-center gap-2.5">
            <span aria-hidden className="size-[5px] rounded-full bg-amber" />
            System state
          </li>
        </ul>
      </div>
    </aside>
  );
}
