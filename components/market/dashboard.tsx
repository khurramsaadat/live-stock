"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { formatClock } from "@/lib/market/format";
import { findSymbol, INDICES } from "@/lib/market/universe";
import { useMarketFeed } from "@/lib/market/use-market-feed";
import { useWatchlist } from "@/lib/market/use-watchlist";
import type { MarketSymbol } from "@/lib/market/types";
import { AddSymbol } from "./add-symbol";
import { IndexCard } from "./index-card";
import { PulseRail } from "./pulse-rail";
import { SessionBadge } from "./session-badge";
import { SessionClock } from "./session-clock";
import { StatusPill } from "./status-pill";
import { WatchlistTable } from "./watchlist-table";

const reveal = (delay: number): CSSProperties =>
  ({ "--reveal-delay": `${delay}ms` }) as CSSProperties;

export function Dashboard() {
  const watchlist = useWatchlist();
  const [theme, setTheme] = useState<'day' | 'dark'>('day');
  const toggleTheme = () => setTheme((prev) => (prev === 'day' ? 'dark' : 'day'));
  // theme persistence is handled locally via the toggle; initial state is 'day'
  const tracked = useMemo<MarketSymbol[]>(() => {
    const watchSymbols = watchlist.symbols
      .map((symbol) => findSymbol(symbol))
      .filter((entry): entry is MarketSymbol => Boolean(entry));
    return [...INDICES, ...watchSymbols];
  }, [watchlist.symbols]);

  const { quotes, status, detail, feedKind, lastUpdated } = useMarketFeed(tracked);

  const indexQuotes = quotes.filter((quote) => quote.kind === "index");
  const watchQuotes = quotes.filter((quote) => quote.kind === "equity");

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header
        className="reveal flex flex-wrap items-center justify-between gap-6 px-8 pb-5 pt-7 sm:px-12"
        style={reveal(0)}
      >
        <div className="flex items-center gap-3.5">
          <span aria-hidden className="mt-1 size-[7px] self-start bg-amber" />
          <div>
            <p className="font-serif text-[1.65rem] leading-none tracking-[-0.015em]">
              Live Stocks
            </p>
            <p className="eyebrow mt-2">Market desk</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="hidden flex-col items-end gap-1.5 sm:flex">
            <SessionClock variant="date" />
            <SessionClock variant="time" />
          </div>
          <span aria-hidden className="hidden h-7 w-px bg-rule sm:block" />
          <SessionBadge />
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-md bg-amber/10 px-2 py-0.5 text-2xs text-amber hover:bg-amber focus-visible:bg-amber focus-visible:text-ink disabled:opacity-40 transition-colors duration-150"
            aria-label={theme === 'day' ? 'Switch to day theme' : 'Switch to dark theme'}
            title={theme === 'day' ? 'Switch to day theme' : 'Switch to dark theme'}
          >
            {theme === 'day' ? '☀' : '☽'}
          </button>
          <span aria-hidden className="h-7 w-px bg-rule" />
          <StatusPill status={status} detail={detail} />
        </div>
      </header>

      <div className="px-8 sm:px-12" aria-hidden>
        <div className="h-px bg-rule-strong" />
        <div className="mt-[3px] h-px bg-rule" />
      </div>

      <main className="flex-1 px-8 pb-12 pt-9 sm:px-12">
        <section aria-labelledby="indices-heading" className="reveal" style={reveal(90)}>
          <div className="flex items-baseline justify-between gap-4">
            <h1 id="indices-heading" className="font-serif text-xl italic">
              Indices
            </h1>
            <span className="eyebrow">Session move</span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-px border-y border-rule bg-rule sm:grid-cols-2">
            {indexQuotes.map((quote) => (
              <IndexCard key={quote.symbol} quote={quote} />
            ))}
          </div>
        </section>

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_272px] lg:gap-14">
          <section
            aria-labelledby="watchlist-heading"
            className="reveal min-w-0"
            style={reveal(170)}
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex items-baseline gap-3">
                <h2 id="watchlist-heading" className="font-serif text-xl italic">
                  Watchlist
                </h2>
                <span className="tabular text-3xs text-ink-muted">
                  {watchQuotes.length} tracked
                </span>
              </div>

              <AddSymbol available={watchlist.available} onAdd={watchlist.add} />
            </div>

            <div className="mt-5">
              <WatchlistTable quotes={watchQuotes} onRemove={watchlist.remove} />
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={watchlist.reset}
                className="font-mono text-3xs uppercase tracking-[0.16em] text-ink-muted transition-colors duration-200 hover:text-amber"
              >
                Reset to default
              </button>
              <p className="tabular text-3xs text-ink-muted">
                Updated {formatClock(lastUpdated)}
              </p>
            </div>
          </section>

          <PulseRail
            quotes={watchQuotes}
            feedKind={feedKind}
            status={status}
            detail={detail}
            lastUpdated={lastUpdated}
            className="reveal"
          />
        </div>
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-rule px-8 py-4 sm:px-12">
        <span className="eyebrow">
          {feedKind === "mock"
            ? "Simulated data · not investment advice"
            : `${feedKind} stream · not investment advice`}
        </span>
        <span className="eyebrow">{theme === 'day' ? 'Daylight' : 'Dark'} theme</span>
        <span className="tabular text-3xs text-ink-muted">v0.1.0</span>
      </footer>
    </div>
  );
}
