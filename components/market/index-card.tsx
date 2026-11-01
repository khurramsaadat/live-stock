import { formatChange, formatPercent, formatPrice } from "@/lib/market/format";
import type { Quote } from "@/lib/market/types";
import { Sparkline } from "./sparkline";
import { changeTone, directionLabel } from "./tone";

export function IndexCard({ quote }: { quote: Quote }) {
  const direction = directionLabel(quote.change);
  const tone = changeTone(quote.change);

  return (
    <article
      className="flex flex-col gap-3 bg-panel px-5 py-5"
      data-testid={`index-card-${quote.symbol}`}
      data-direction={direction}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-mono text-3xs uppercase tracking-[0.16em] text-ink-muted">
          {quote.name}
        </h2>
        <span className="tabular text-3xs text-ink-muted">{quote.symbol}</span>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p
            className="tabular text-2xl font-medium leading-none tracking-tight"
            data-testid={`level-${quote.symbol}`}
          >
            {formatPrice(quote.price)}
          </p>
          <p className={`mt-2 flex items-baseline gap-2 text-[0.78rem] ${tone}`}>
            <span className="tabular">{formatChange(quote.change)}</span>
            <span className="tabular opacity-75">{formatPercent(quote.changePercent)}</span>
          </p>
        </div>
        <Sparkline
          values={quote.history}
          width={80}
          height={32}
          className={`hidden shrink-0 sm:block ${tone}`}
        />
      </div>
    </article>
  );
}
