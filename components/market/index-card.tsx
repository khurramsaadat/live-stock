import { formatChange, formatPercent, formatPrice } from "@/lib/market/format";
import type { Quote } from "@/lib/market/types";
import { Sparkline } from "./sparkline";
import { changeTone, directionLabel } from "./tone";

export function IndexCard({ quote }: { quote: Quote }) {
  const direction = directionLabel(quote.change);
  const tone = changeTone(quote.change);

  const values = quote.history.length > 1 ? quote.history : [quote.previousClose];
  const low = Math.min(...values);
  const high = Math.max(...values);
  const position = high === low ? 50 : ((quote.price - low) / (high - low)) * 100;
  const clamped = Math.min(100, Math.max(0, position));

  return (
    <article
      className="flex flex-col gap-5 bg-paper px-6 py-6"
      data-testid={`index-card-${quote.symbol}`}
      data-direction={direction}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-mono text-3xs uppercase tracking-[0.18em] text-ink-soft">
          {quote.name}
        </h2>
        <span className="tabular text-3xs text-ink-muted">{quote.symbol}</span>
      </div>

      <div className="flex items-end justify-between gap-5">
        <div className="min-w-0">
          <p
            className="tabular text-[clamp(2.2rem,4vw,3rem)] font-medium leading-[0.9] tracking-[-0.04em]"
            data-testid={`level-${quote.symbol}`}
          >
            {formatPrice(quote.price)}
          </p>

          <p className={`mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[0.8rem] ${tone}`}>
            <span className="tabular">{formatChange(quote.change)}</span>
            <span className="tabular opacity-75">{formatPercent(quote.changePercent)}</span>
            <span className="eyebrow">prev close</span>
          </p>
        </div>

        <Sparkline
          values={quote.history}
          width={112}
          height={40}
          className={`hidden shrink-0 sm:block ${tone}`}
        />
      </div>

      <div>
        <div className="relative h-px w-full bg-rule-strong">
          <span
            aria-hidden
            className="absolute -top-[2px] size-[5px] rounded-full bg-amber transition-[left] duration-700 ease-out"
            style={{ left: `${clamped}%`, transform: "translateX(-50%)" }}
          />
        </div>
        <div className="tabular mt-2 flex items-baseline justify-between gap-3 text-3xs text-ink-muted">
          <span>{formatPrice(low)}</span>
          <span className="eyebrow">day range</span>
          <span>{formatPrice(high)}</span>
        </div>
      </div>
    </article>
  );
}
