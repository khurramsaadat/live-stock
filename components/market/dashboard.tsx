"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
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
import { TabNav, type TabId } from "./tab-nav";
import { TickerTape } from "./ticker-tape";
import { WatchlistTable } from "./watchlist-table";
import { Heatmap } from "./heatmap";
import { ChartView } from "./chart-view";

const reveal = (delay: number): CSSProperties =>
  ({ "--reveal-delay": `${delay}ms` }) as CSSProperties;

export function Dashboard() {
  const watchlist = useWatchlist();
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("ls-theme") as "dark" | "light" | null;
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("ls-theme", next);
      return next;
    });
  };

  const tracked = useMemo<MarketSymbol[]>(() => {
    const watchSymbols = watchlist.symbols
      .map((symbol) => findSymbol(symbol))
      .filter((entry): entry is MarketSymbol => Boolean(entry));
    return [...INDICES, ...watchSymbols];
  }, [watchlist.symbols]);

  const { quotes, status, detail, feedKind, lastUpdated } = useMarketFeed(tracked);

  const indexQuotes = quotes.filter((q) => q.kind === "index");
  const watchQuotes = quotes.filter((q) => q.kind === "equity");
  const allQuotes = [...indexQuotes, ...watchQuotes];

  return (
    <div className="flex min-h-screen flex-col bg-ground">
      {/* Ticker Tape */}
      <TickerTape quotes={allQuotes} />

      {/* Header */}
      <header className="flex items-center justify-between gap-4 px-6 py-3 sm:px-8">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="size-2 rounded-full bg-accent"
            />
            <span className="font-serif text-lg leading-none tracking-tight text-ink">
              Live Stocks
            </span>
          </div>
          <TabNav active={activeTab} onChange={setActiveTab} />
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-3 sm:flex">
            <SessionClock variant="date" />
            <span aria-hidden className="h-4 w-px bg-border" />
            <SessionClock variant="time" />
          </div>
          <span aria-hidden className="hidden h-4 w-px bg-border sm:block" />
          <SessionBadge />
          <StatusPill status={status} detail={detail} />
          <button
            type="button"
            onClick={toggleTheme}
            className="flex size-8 items-center justify-center rounded-full bg-panel-raised text-ink-muted transition-colors duration-150 hover:bg-accent hover:text-ground"
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </div>
      </header>

      <div aria-hidden className="h-px bg-border" />

      {/* Tab Content */}
      <main className="flex-1">
        {activeTab === "dashboard" && (
          <DashboardTab
            indexQuotes={indexQuotes}
            watchQuotes={watchQuotes}
            feedKind={feedKind}
            status={status}
            detail={detail}
            lastUpdated={lastUpdated}
          />
        )}

        {activeTab === "watchlist" && (
          <WatchlistTab
            watchQuotes={watchQuotes}
            watchlist={watchlist}
            feedKind={feedKind}
            lastUpdated={lastUpdated}
          />
        )}

        {activeTab === "heatmap" && (
          <div className="p-6 sm:p-8">
            <Heatmap quotes={watchQuotes.filter((q) => q.updatedAt !== null)} />
          </div>
        )}

        {activeTab === "charts" && (
          <div className="p-6 sm:p-8">
            <ChartView quotes={watchQuotes.filter((q) => q.updatedAt !== null)} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-6 py-3 sm:px-8">
        <span className="eyebrow">
          {feedKind} stream - not investment advice
        </span>
        <span className="tabular text-3xs text-ink-muted">
          Updated {formatClock(lastUpdated)}
        </span>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard Tab                                                      */
/* ------------------------------------------------------------------ */

import type { FeedStatus, Quote } from "@/lib/market/types";

function DashboardTab({
  indexQuotes,
  watchQuotes,
  feedKind,
  status,
  detail,
  lastUpdated,
}: {
  indexQuotes: Quote[];
  watchQuotes: Quote[];
  feedKind: string;
  status: FeedStatus;
  detail?: string;
  lastUpdated: number | null;
}) {
  return (
    <div className="p-6 sm:p-8">
      {/* Indices */}
      <section className="reveal" style={reveal(0)}>
        <h1 className="font-serif text-xl italic text-ink">Indices</h1>
        <div className="mt-4 grid grid-cols-1 gap-px rounded-card border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {indexQuotes.map((q) => (
            <IndexCard key={q.symbol} quote={q} />
          ))}
        </div>
      </section>

      {/* Bottom grid */}
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_280px]">
        {/* Top movers */}
        <section className="reveal" style={reveal(80)}>
          <h2 className="font-serif text-xl italic text-ink">Top movers</h2>
          <div className="mt-4 grid gap-px rounded-card border border-border bg-border sm:grid-cols-2">
            <MoverList title="Leaders" quotes={watchQuotes.filter((q) => q.change > 0).sort((a, b) => b.changePercent - a.changePercent).slice(0, 5)} />
            <MoverList title="Laggards" quotes={watchQuotes.filter((q) => q.change < 0).sort((a, b) => a.changePercent - b.changePercent).slice(0, 5)} />
          </div>
        </section>

        {/* Pulse rail */}
        <PulseRail
          quotes={watchQuotes}
          feedKind={feedKind}
          status={status}
          detail={detail}
          lastUpdated={lastUpdated}
          className="reveal"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mover List                                                         */
/* ------------------------------------------------------------------ */

import { formatPercent, formatPrice } from "@/lib/market/format";
import { changeTone } from "./tone";

function MoverList({ title, quotes }: { title: string; quotes: Quote[] }) {
  return (
    <div className="bg-panel p-5">
      <p className="eyebrow">{title}</p>
      {quotes.length === 0 ? (
        <p className="mt-3 text-[0.78rem] text-ink-muted">No movers yet.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {quotes.map((q) => (
            <li key={q.symbol} className="flex items-baseline justify-between gap-3">
              <div className="flex items-baseline gap-2">
                <span className="tabular text-[0.8rem] font-medium">{q.symbol}</span>
                <span className="tabular text-[0.75rem] text-ink-muted">{formatPrice(q.price)}</span>
              </div>
              <span className={`tabular text-[0.8rem] font-medium ${changeTone(q.change)}`}>
                {formatPercent(q.changePercent)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Watchlist Tab                                                      */
/* ------------------------------------------------------------------ */

function WatchlistTab({
  watchQuotes,
  watchlist,
  feedKind,
  lastUpdated,
}: {
  watchQuotes: Quote[];
  watchlist: ReturnType<typeof useWatchlist>;
  feedKind: string;
  lastUpdated: number | null;
}) {
  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h1 className="font-serif text-xl italic text-ink">Watchlist</h1>
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
          className="rounded-full border border-border px-3 py-1 font-mono text-3xs uppercase tracking-[0.14em] text-ink-muted transition-colors duration-200 hover:border-accent hover:text-accent"
        >
          Reset to default
        </button>
        <p className="tabular text-3xs text-ink-muted">
          Updated {formatClock(lastUpdated)}
        </p>
      </div>
    </div>
  );
}
