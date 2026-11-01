"use client";

import { useMemo, useState } from "react";
import { formatChange, formatPercent, formatPrice } from "@/lib/market/format";
import type { Quote } from "@/lib/market/types";
import { Sparkline } from "./sparkline";
import { changeTone, directionLabel } from "./tone";

type SortKey = "symbol" | "price" | "change" | "changePercent";
type SortState = { key: SortKey; dir: "asc" | "desc" } | null;

interface WatchlistTableProps {
  quotes: Quote[];
  onRemove: (symbol: string) => void;
}

/** Compares the last two prints so a tick can tint in its own direction. */
function tickClass(quote: Quote): string {
  const history = quote.history;
  if (history.length < 2) return "";
  const last = history[history.length - 1];
  const previous = history[history.length - 2];
  if (last === previous) return "";
  return last > previous ? "tick-up" : "tick-down";
}

function SortHeader({
  column,
  label,
  sort,
  onSort,
  align = "text-right",
  className = "",
}: {
  column: SortKey;
  label: string;
  sort: SortState;
  onSort: (key: SortKey) => void;
  align?: string;
  className?: string;
}) {
  const active = sort?.key === column;
  const direction = active ? sort.dir : null;

  return (
    <th
      scope="col"
      aria-sort={direction === "asc" ? "ascending" : direction === "desc" ? "descending" : "none"}
      className={`py-2.5 font-normal ${align} ${className}`}
    >
      <button
        type="button"
        data-testid={`sort-${column}`}
        data-sort-state={direction ?? "none"}
        onClick={() => onSort(column)}
        className={`inline-flex items-baseline gap-1.5 font-mono text-3xs uppercase tracking-[0.16em] transition-colors duration-200 hover:text-ink ${
          active ? "text-ink" : "text-ink-muted"
        }`}
      >
        {label}
        <span aria-hidden className={active ? "text-amber" : "text-rule-strong"}>
          {direction === "asc" ? "▲" : "▼"}
        </span>
        <span className="sr-only">
          {active
            ? `Sort by ${label}, currently ${direction === "asc" ? "ascending" : "descending"}`
            : `Sort by ${label}`}
        </span>
      </button>
    </th>
  );
}

export function WatchlistTable({ quotes, onRemove }: WatchlistTableProps) {
  const [sort, setSort] = useState<SortState>(null);

  const handleSort = (key: SortKey) => {
    setSort((current) => {
      if (current?.key !== key) return { key, dir: key === "symbol" ? "asc" : "desc" };
      return { key, dir: current.dir === "asc" ? "desc" : "asc" };
    });
  };

  const ordered = useMemo(() => {
    if (!sort) return quotes;
    const factor = sort.dir === "asc" ? 1 : -1;
    return [...quotes].sort((a, b) => {
      if (sort.key === "symbol") return a.symbol.localeCompare(b.symbol) * factor;
      return (a[sort.key] - b[sort.key]) * factor;
    });
  }, [quotes, sort]);

  if (quotes.length === 0) {
    return (
      <div className="border-t border-rule py-10">
        <p className="font-serif text-xl italic text-ink-soft">Nothing tracked yet.</p>
        <p className="mt-2 text-[0.8rem] leading-relaxed text-ink-muted">
          Search for a symbol above to put it on the ledger.
        </p>
      </div>
    );
  }

  return (
    <table className="w-full border-collapse text-left" data-testid="watchlist-table">
      <thead>
        <tr className="border-b border-rule-strong">
          <SortHeader
            column="symbol"
            label="Symbol"
            sort={sort}
            onSort={handleSort}
            align="text-left"
            className="w-[38%] pl-3"
          />
          <th scope="col" className="eyebrow hidden py-2.5 font-normal md:table-cell">
            Intraday
          </th>
          <SortHeader column="price" label="Last" sort={sort} onSort={handleSort} />
          <SortHeader column="change" label="Chg" sort={sort} onSort={handleSort} />
          <SortHeader
            column="changePercent"
            label="Chg %"
            sort={sort}
            onSort={handleSort}
            className="pr-1"
          />
          <th scope="col" className="w-8 py-2.5">
            <span className="sr-only">Actions</span>
          </th>
        </tr>
      </thead>

      <tbody>
        {ordered.map((quote) => {
          const direction = directionLabel(quote.change);
          const tone = changeTone(quote.change);

          return (
            <tr
              key={quote.symbol}
              className="group border-b border-rule transition-colors duration-200 hover:bg-paper-raised"
              data-testid={`row-${quote.symbol}`}
              data-direction={direction}
            >
              <th
                scope="row"
                className="border-l-2 border-transparent py-3.5 pl-3 pr-4 font-normal transition-colors duration-200 group-hover:border-amber"
              >
                <span className="tabular block text-[0.8rem] tracking-[0.02em]">
                  {quote.symbol}
                </span>
                <span className="mt-0.5 block truncate text-[0.72rem] text-ink-muted">
                  {quote.name}
                </span>
              </th>

              <td className={`hidden py-3.5 pr-4 md:table-cell ${tone}`}>
                <Sparkline values={quote.history} width={96} height={26} />
              </td>

              <td className="py-3.5 pl-2 text-right">
                <span
                  key={quote.price}
                  className={`tabular inline-block px-1.5 py-0.5 text-[0.82rem] ${tickClass(quote)}`}
                >
                  {formatPrice(quote.price)}
                </span>
              </td>

              <td className={`tabular py-3.5 pl-2 text-right text-[0.8rem] ${tone}`}>
                {formatChange(quote.change)}
              </td>

              <td className={`tabular py-3.5 pl-2 pr-1 text-right text-[0.8rem] ${tone}`}>
                {formatPercent(quote.changePercent)}
              </td>

              <td className="py-3.5 text-right">
                <button
                  type="button"
                  onClick={() => onRemove(quote.symbol)}
                  className="font-mono text-[0.9rem] leading-none text-ink-muted opacity-0 transition-opacity duration-200 hover:text-rust focus-visible:opacity-100 group-hover:opacity-100"
                  aria-label={`Remove ${quote.symbol} from the watchlist`}
                >
                  ×
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
