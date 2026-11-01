"use client";

import { useMemo, useState } from "react";
import { formatChange, formatPercent, formatPrice } from "@/lib/market/format";
import type { Quote } from "@/lib/market/types";
import { changeTone } from "./tone";
import { StockIcon } from "./stock-icon";
import { Sparkline } from "./sparkline";

type SortKey = "symbol" | "price" | "changePercent" | "previousClose";
type SortDir = "asc" | "desc";
type FilterSector = "all" | "gain" | "loss";

interface ScreenerProps {
  quotes: Quote[];
  onSymbolClick: (symbol: string) => void;
}

export function Screener({ quotes, onSymbolClick }: ScreenerProps) {
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: "previousClose", dir: "desc" });
  const [filter, setFilter] = useState<FilterSector>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = quotes;
    if (filter === "gain") list = list.filter((q) => q.change > 0);
    if (filter === "loss") list = list.filter((q) => q.change < 0);
    if (search) {
      const s = search.toUpperCase();
      list = list.filter((q) => q.symbol.includes(s) || q.name.toUpperCase().includes(s));
    }
    return list;
  }, [quotes, filter, search]);

  const sorted = useMemo(() => {
    const factor = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      if (sort.key === "symbol") return a.symbol.localeCompare(b.symbol) * factor;
      return (a[sort.key] - b[sort.key]) * factor;
    });
  }, [filtered, sort]);

  const handleSort = (key: SortKey) => {
    setSort((prev) => ({
      key,
      dir: prev.key === key && prev.dir === "desc" ? "asc" : "desc",
    }));
  };

  const filters: { id: FilterSector; label: string }[] = [
    { id: "all", label: "All" },
    { id: "gain", label: "Gainers" },
    { id: "loss", label: "Losers" },
  ];

  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="heading-lg text-ink">Stock Screener</h1>
          <p className="mt-1 text-sm text-ink-muted">{quotes.length} stocks tracked</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search stocks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-56 rounded-card border border-border bg-panel pl-9 pr-4 text-sm text-ink outline-none placeholder:text-ink-muted focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>

          {/* Filter pills */}
          <div className="flex gap-1 rounded-card border border-border bg-panel p-1">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`rounded-sm px-3 py-1.5 text-[0.8rem] font-medium transition-colors ${
                  filter === f.id
                    ? "bg-accent text-ground"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-card border border-border">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-panel-sunken">
              <th className="w-16 py-3 pl-4 pr-2">
                <span className="sr-only">Icon</span>
              </th>
              <SortTh column="symbol" label="Symbol" sort={sort} onSort={handleSort} align="text-left" />
              <th className="hidden py-3 md:table-cell">
                <span className="eyebrow">Trend</span>
              </th>
              <SortTh column="price" label="Price" sort={sort} onSort={handleSort} />
              <SortTh column="changePercent" label="Change %" sort={sort} onSort={handleSort} />
              <th className="hidden py-3 pr-4 text-right lg:table-cell">
                <span className="eyebrow">Change</span>
              </th>
              <SortTh column="previousClose" label="Prev Close" sort={sort} onSort={handleSort} className="hidden xl:table-cell" />
              <th className="hidden py-3 pr-4 text-right xl:table-cell">
                <span className="eyebrow">Data pts</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((q) => {
              const tone = changeTone(q.change);
              const values = q.history.length >= 2 ? q.history : [q.previousClose, q.price];
              return (
                <tr
                  key={q.symbol}
                  className="group cursor-pointer border-b border-border bg-panel transition-colors hover:bg-panel-raised"
                  onClick={() => onSymbolClick(q.symbol)}
                >
                  <td className="py-3 pl-4 pr-2">
                    <StockIcon symbol={q.symbol} size={32} />
                  </td>
                  <td className="py-3 pr-4">
                    <span className="block text-[0.9rem] font-semibold tracking-wide group-hover:text-accent transition-colors">
                      {q.symbol}
                    </span>
                    <span className="mt-0.5 block truncate text-[0.78rem] text-ink-muted">
                      {q.name}
                    </span>
                  </td>
                  <td className={`hidden py-3 pr-4 md:table-cell ${tone}`}>
                    <Sparkline values={values} width={80} height={24} />
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <span className="tabular text-[0.9rem] font-medium">
                      {formatPrice(q.price)}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <span className={`inline-flex items-center rounded-sm px-2 py-0.5 tabular text-[0.82rem] font-semibold ${
                      q.change > 0 ? "bg-gain-bg text-gain" : q.change < 0 ? "bg-loss-bg text-loss" : "text-ink-muted"
                    }`}>
                      {formatPercent(q.changePercent)}
                    </span>
                  </td>
                  <td className={`hidden py-3 pr-4 text-right tabular text-[0.82rem] lg:table-cell ${tone}`}>
                    {formatChange(q.change)}
                  </td>
                  <td className="hidden py-3 pr-4 text-right tabular text-[0.82rem] text-ink-muted xl:table-cell">
                    {formatPrice(q.previousClose)}
                  </td>
                  <td className="hidden py-3 pr-4 text-right tabular text-[0.78rem] text-ink-muted xl:table-cell">
                    {q.history.length}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {sorted.length === 0 && (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-ink-muted">No stocks match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SortTh({
  column,
  label,
  sort,
  onSort,
  align = "text-right",
  className = "",
}: {
  column: SortKey;
  label: string;
  sort: { key: SortKey; dir: SortDir };
  onSort: (key: SortKey) => void;
  align?: string;
  className?: string;
}) {
  const active = sort.key === column;
  return (
    <th className={`py-3 pr-4 font-normal ${align} ${className}`}>
      <button
        type="button"
        onClick={() => onSort(column)}
        className={`inline-flex items-center gap-1.5 text-[0.72rem] font-medium uppercase tracking-wide transition-colors hover:text-ink ${
          active ? "text-ink" : "text-ink-muted"
        }`}
      >
        {label}
        <span className={active ? "text-accent" : "text-border-strong"}>
          {active && sort.dir === "asc" ? "▲" : "▼"}
        </span>
      </button>
    </th>
  );
}
