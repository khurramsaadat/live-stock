"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { formatClock, formatChange, formatPercent, formatPrice } from "@/lib/market/format";
import { findSymbol, INDICES } from "@/lib/market/universe";
import { useMarketFeed } from "@/lib/market/use-market-feed";
import { useWatchlist } from "@/lib/market/use-watchlist";
import type { FeedStatus, MarketSymbol, Quote } from "@/lib/market/types";
import { AddSymbol } from "./add-symbol";
import { BackToTop } from "./back-to-top";
import { IndexCard } from "./index-card";
import { SessionBadge } from "./session-badge";
import { SessionClock } from "./session-clock";
import { StatusPill } from "./status-pill";
import { StockDetail } from "./stock-detail";
import { TabNav, type TabId } from "./tab-nav";
import { TickerTape } from "./ticker-tape";
import { WatchlistTable } from "./watchlist-table";
import { Heatmap } from "./heatmap";
import { ChartView } from "./chart-view";
import { changeTone } from "./tone";
import { Sparkline } from "./sparkline";

const reveal = (delay: number): CSSProperties =>
  ({ "--reveal-delay": `${delay}ms` }) as CSSProperties;

export function Dashboard() {
  const watchlist = useWatchlist();
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [detailSymbol, setDetailSymbol] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("ls-theme") as "dark" | "light" | null;
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDetailSymbol(null);
      if (e.altKey && e.key === "1") { e.preventDefault(); setActiveTab("dashboard"); }
      if (e.altKey && e.key === "2") { e.preventDefault(); setActiveTab("watchlist"); }
      if (e.altKey && e.key === "3") { e.preventDefault(); setActiveTab("heatmap"); }
      if (e.altKey && e.key === "4") { e.preventDefault(); setActiveTab("charts"); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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

  const goToChart = (symbol: string) => {
    setSelectedSymbol(symbol);
    setActiveTab("charts");
  };

  return (
    <div className="flex min-h-screen flex-col bg-ground">
      <TickerTape quotes={allQuotes} onSymbolClick={goToChart} />

      {/* Header */}
      <header className="flex items-center justify-between gap-4 px-6 py-3 sm:px-8">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => setActiveTab("dashboard")}
            className="flex items-center gap-2.5"
          >
            <span aria-hidden className="size-2 rounded-full bg-accent" />
            <span className="font-serif text-lg leading-none tracking-tight text-ink">
              Live Stocks
            </span>
          </button>
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
          >
            {theme === "dark" ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
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
            onSymbolClick={goToChart}
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
            onSymbolClick={goToChart}
            lastUpdated={lastUpdated}
          />
        )}
        {activeTab === "heatmap" && (
          <div className="p-6 sm:p-8">
            <Heatmap quotes={watchQuotes} onSymbolClick={goToChart} />
          </div>
        )}
        {activeTab === "charts" && (
          <div className="p-6 sm:p-8">
            <ChartView
              quotes={watchQuotes.length > 0 ? watchQuotes : allQuotes}
              initialSymbol={selectedSymbol}
            />
          </div>
        )}
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-6 py-3 sm:px-8">
        <span className="eyebrow">{feedKind} stream - not investment advice</span>
        <span className="tabular text-3xs text-ink-muted">Updated {formatClock(lastUpdated)}</span>
      </footer>

      <BackToTop />

      {/* Stock detail overlay */}
      {detailSymbol && (() => {
        const dq = allQuotes.find((q) => q.symbol === detailSymbol);
        if (!dq) return null;
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ground/70 backdrop-blur-sm"
            onClick={() => setDetailSymbol(null)}
          >
            <div className="w-full max-w-lg mx-4 animate-in" onClick={(e) => e.stopPropagation()}>
              <StockDetail
                quote={dq}
                onClose={() => setDetailSymbol(null)}
              />
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard Tab                                                      */
/* ------------------------------------------------------------------ */

function DashboardTab({
  indexQuotes,
  watchQuotes,
  onSymbolClick,
  feedKind,
  status,
  detail,
  lastUpdated,
}: {
  indexQuotes: Quote[];
  watchQuotes: Quote[];
  onSymbolClick: (symbol: string) => void;
  feedKind: string;
  status: FeedStatus;
  detail?: string;
  lastUpdated: number | null;
}) {
  const advancing = watchQuotes.filter((q) => q.change > 0);
  const declining = watchQuotes.filter((q) => q.change < 0);
  const flat = watchQuotes.filter((q) => q.change === 0);

  const sorted = [...watchQuotes].sort((a, b) => b.changePercent - a.changePercent);
  const gainers = sorted.filter((q) => q.changePercent > 0).slice(0, 5);
  const losers = sorted.filter((q) => q.changePercent < 0).reverse().slice(0, 5);
  const mostActive = [...watchQuotes]
    .filter((q) => q.history.length > 0)
    .sort((a, b) => b.history.length - a.history.length)
    .slice(0, 5);

  return (
    <div className="p-6 sm:p-8">
      {/* Indices */}
      <section className="reveal" style={reveal(0)}>
        <h1 className="font-serif text-xl italic text-ink">Market summary</h1>
        <div className="mt-4 grid grid-cols-1 gap-px rounded-card border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {indexQuotes.map((q) => (
            <IndexCard key={q.symbol} quote={q} onClick={() => onSymbolClick(q.symbol)} />
          ))}
        </div>
      </section>

      {/* Two column grid */}
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {/* Gainers */}
        <section className="reveal rounded-card border border-border bg-panel" style={reveal(60)}>
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <h2 className="font-serif text-base italic">Top gainers</h2>
            <span className="eyebrow">{gainers.length} advancing</span>
          </div>
          <StockList quotes={gainers} onSymbolClick={onSymbolClick} emptyText="No gainers today" />
        </section>

        {/* Losers */}
        <section className="reveal rounded-card border border-border bg-panel" style={reveal(80)}>
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <h2 className="font-serif text-base italic">Top losers</h2>
            <span className="eyebrow">{losers.length} declining</span>
          </div>
          <StockList quotes={losers} onSymbolClick={onSymbolClick} emptyText="No losers today" />
        </section>
      </div>

      {/* Market breadth + Most active */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Most active */}
        <section className="reveal rounded-card border border-border bg-panel" style={reveal(100)}>
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <h2 className="font-serif text-base italic">Most active</h2>
            <span className="eyebrow">{watchQuotes.length} tracked</span>
          </div>
          <StockList quotes={mostActive.length > 0 ? mostActive : watchQuotes.slice(0, 5)} onSymbolClick={onSymbolClick} emptyText="No data yet" />
        </section>

        {/* Market breadth card */}
        <section className="reveal rounded-card border border-border bg-panel p-5" style={reveal(120)}>
          <h2 className="font-serif text-base italic">Market breadth</h2>

          {/* Advancing / Declining bar */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-3xs">
              <span className="eyebrow">Advancing</span>
              <span className="eyebrow">Declining</span>
            </div>
            <div className="mt-2 flex h-2 w-full overflow-hidden rounded-full">
              <span className="bg-gain" style={{ width: `${(advancing.length / Math.max(1, watchQuotes.length)) * 100}%` }} />
              <span className="bg-ink-muted/20" style={{ width: `${(flat.length / Math.max(1, watchQuotes.length)) * 100}%` }} />
              <span className="bg-loss" style={{ width: `${(declining.length / Math.max(1, watchQuotes.length)) * 100}%` }} />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="tabular text-[0.7rem] text-gain">{advancing.length} - {Math.round((advancing.length / Math.max(1, watchQuotes.length)) * 100)}%</span>
              <span className="tabular text-[0.7rem] text-loss">{declining.length} - {Math.round((declining.length / Math.max(1, watchQuotes.length)) * 100)}%</span>
            </div>
          </div>

          {/* Performance bars */}
          <div className="mt-6">
            <p className="eyebrow">Performance spread</p>
            <ul className="mt-3 space-y-2.5">
              {sorted.slice(0, 6).map((q) => {
                const barWidth = Math.min(100, Math.abs(q.changePercent) * 5);
                return (
                  <li key={q.symbol} className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onSymbolClick(q.symbol)}
                      className="w-14 text-left tabular text-[0.72rem] font-medium hover:text-accent transition-colors"
                    >
                      {q.symbol}
                    </button>
                    <div className="flex-1 h-1.5 bg-panel-raised rounded-full overflow-hidden">
                      {q.changePercent >= 0 ? (
                        <div className="h-full bg-gain rounded-full" style={{ width: `${barWidth}%` }} />
                      ) : (
                        <div className="h-full bg-loss rounded-full ml-auto" style={{ width: `${barWidth}%` }} />
                      )}
                    </div>
                    <span className={`tabular text-[0.7rem] w-14 text-right ${changeTone(q.change)}`}>
                      {formatPercent(q.changePercent)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Stream info */}
          <div className="mt-6 border-t border-border pt-4">
            <p className="eyebrow">Stream</p>
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
        </section>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stock List (reusable for gainers, losers, most active)             */
/* ------------------------------------------------------------------ */

function StockList({
  quotes,
  onSymbolClick,
  emptyText,
}: {
  quotes: Quote[];
  onSymbolClick: (symbol: string) => void;
  emptyText: string;
}) {
  if (quotes.length === 0) {
    return <p className="px-5 py-6 text-[0.78rem] text-ink-muted">{emptyText}</p>;
  }

  return (
    <ul>
      {quotes.map((q) => (
        <li key={q.symbol}>
          <button
            type="button"
            onClick={() => onSymbolClick(q.symbol)}
            className="group flex w-full items-center gap-4 border-b border-border px-5 py-3 transition-colors duration-100 hover:bg-panel-raised"
          >
            <div className="flex-1 min-w-0 text-left">
              <span className="tabular text-[0.82rem] font-medium group-hover:text-accent transition-colors">{q.symbol}</span>
              <span className="ml-2 text-[0.72rem] text-ink-muted truncate">{q.name}</span>
            </div>
            <Sparkline
              values={q.history.length >= 2 ? q.history : [q.previousClose, q.price]}
              width={56}
              height={20}
              className={`shrink-0 ${changeTone(q.change)}`}
            />
            <span className="tabular w-20 text-right text-[0.82rem]">{formatPrice(q.price)}</span>
            <span className={`tabular w-16 text-right text-[0.78rem] font-medium ${changeTone(q.change)}`}>
              {formatPercent(q.changePercent)}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/*  Watchlist Tab                                                      */
/* ------------------------------------------------------------------ */

function WatchlistTab({
  watchQuotes,
  watchlist,
  onSymbolClick,
  lastUpdated,
}: {
  watchQuotes: Quote[];
  watchlist: ReturnType<typeof useWatchlist>;
  onSymbolClick: (symbol: string) => void;
  lastUpdated: number | null;
}) {
  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h1 className="font-serif text-xl italic text-ink">Watchlist</h1>
          <span className="tabular text-3xs text-ink-muted">{watchQuotes.length} tracked</span>
        </div>
        <AddSymbol available={watchlist.available} onAdd={watchlist.add} />
      </div>

      <div className="mt-5">
        <WatchlistTable quotes={watchQuotes} onRemove={watchlist.remove} onSymbolClick={onSymbolClick} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={watchlist.reset}
          className="rounded-full border border-border px-3 py-1 font-mono text-3xs uppercase tracking-[0.14em] text-ink-muted transition-colors duration-200 hover:border-accent hover:text-accent"
        >
          Reset to default
        </button>
        <p className="tabular text-3xs text-ink-muted">Updated {formatClock(lastUpdated)}</p>
      </div>
    </div>
  );
}
