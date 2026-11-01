"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { INDICES, WATCHLIST_UNIVERSE, type Sector } from "@/lib/market/universe";
import { useMarketFeed } from "@/lib/market/use-market-feed";
import { formatChange, formatPercent, formatPrice } from "@/lib/market/format";
import { StockIcon } from "@/components/market/stock-icon";
import { Sparkline } from "@/components/market/sparkline";
import { BackToTop } from "@/components/market/back-to-top";
import type { MarketSymbol, Quote } from "@/lib/market/types";

const SECTOR_COLORS: Record<Sector, string> = {
  Technology: "#3B82F6",
  Financials: "#8B5CF6",
  Healthcare: "#06B6D4",
  "Consumer Cyclical": "#F59E0B",
  "Consumer Defensive": "#10B981",
  Energy: "#EF4444",
  Industrials: "#6366F1",
  Communication: "#EC4899",
  "Real Estate": "#14B8A6",
  Utilities: "#84CC16",
  Materials: "#F97316",
};

const HERO_STOCKS = ["NVDA", "AAPL", "AMZN", "GOOGL", "TSLA", "MSFT"];

type MarketTab = "stocks" | "indices";

export default function MarketsPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeTab, setActiveTab] = useState<MarketTab>("stocks");

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
    return [...INDICES, ...WATCHLIST_UNIVERSE];
  }, []);

  const { quotes } = useMarketFeed(tracked);

  const indexQuotes = quotes.filter((q) => q.kind === "index");
  const equityQuotes = quotes.filter((q) => q.kind === "equity");

  const heroQuotes = HERO_STOCKS
    .map((s) => equityQuotes.find((q) => q.symbol === s))
    .filter((q): q is Quote => Boolean(q));

  const sectorMap = useMemo(() => {
    const map = new Map<Sector, Quote[]>();
    for (const q of equityQuotes) {
      const entry = WATCHLIST_UNIVERSE.find((s) => s.symbol === q.symbol);
      if (!entry) continue;
      const existing = map.get(entry.sector) ?? [];
      existing.push(q);
      map.set(entry.sector, existing);
    }
    return map;
  }, [equityQuotes]);

  const topGainers = useMemo(
    () => [...equityQuotes].sort((a, b) => b.changePercent - a.changePercent).slice(0, 6),
    [equityQuotes],
  );

  const topLosers = useMemo(
    () => [...equityQuotes].sort((a, b) => a.changePercent - b.changePercent).slice(0, 6),
    [equityQuotes],
  );

  const mostActive = useMemo(
    () =>
      [...equityQuotes]
        .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
        .slice(0, 6),
    [equityQuotes],
  );

  return (
    <div className="flex min-h-screen flex-col bg-ground">
      {/* Header */}
      <header className="fixed top-0 z-40 w-full border-b border-border/50 bg-ground/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-accent">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <span className="font-heading text-lg font-bold tracking-tight text-ink">LiveStocks</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/" className="text-[0.85rem] text-ink-muted transition-colors hover:text-ink">Home</Link>
            <span className="text-[0.85rem] font-medium text-ink">Markets</span>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex size-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-panel-raised hover:text-ink"
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              {theme === "dark" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
            <Link
              href="/"
              className="rounded-full bg-accent px-5 py-2.5 text-[0.85rem] font-semibold text-ground transition-all hover:brightness-110"
            >
              Open App
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="relative border-b border-border bg-ground py-16 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1400&q=60&auto=format')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative mx-auto max-w-7xl px-6">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              Markets today
            </h1>
            <p className="mt-3 max-w-xl text-lg text-ink-secondary">
              Live stock prices, market indices, top movers, and sector performance - all in one place.
            </p>

            {/* Hero stock cards */}
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {heroQuotes.map((q) => (
                <div
                  key={q.symbol}
                  className="group rounded-card border border-border bg-panel p-4 transition-all hover:border-border-strong hover:shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <StockIcon symbol={q.symbol} size={28} />
                    <div>
                      <p className="text-[0.8rem] font-semibold text-ink">{q.symbol}</p>
                      <p className="text-[0.65rem] text-ink-muted">{q.name}</p>
                    </div>
                  </div>
                  <p className="tabular mt-3 text-lg font-semibold text-ink">{formatPrice(q.price)}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`tabular text-[0.78rem] font-medium ${q.change >= 0 ? "text-gain" : "text-loss"}`}>
                      {formatChange(q.change)}
                    </span>
                    <span className={`tabular text-[0.78rem] font-medium ${q.change >= 0 ? "text-gain" : "text-loss"}`}>
                      ({formatPercent(q.changePercent)})
                    </span>
                  </div>
                  <div className="mt-2">
                    <Sparkline values={q.history} width={120} height={28} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="sticky top-16 z-30 border-b border-border bg-ground/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl items-center gap-0 px-6">
            {(["stocks", "indices"] as MarketTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 px-5 py-3.5 text-[0.85rem] font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? "border-accent text-ink"
                    : "border-transparent text-ink-muted hover:text-ink"
                }`}
              >
                {tab === "stocks" ? "US Stocks" : "Indices"}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "stocks" && (
          <div className="mx-auto max-w-7xl px-6 py-10 space-y-16">
            {/* Top Gainers */}
            <section>
              <div className="flex items-center gap-3">
                <h2 className="font-heading text-xl font-bold text-ink">Stock Gainers</h2>
                <span className="rounded-full bg-gain/10 px-2.5 py-0.5 text-[0.7rem] font-medium text-gain">Top {topGainers.length}</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {topGainers.map((q) => (
                  <StockRow key={q.symbol} quote={q} />
                ))}
              </div>
            </section>

            {/* Top Losers */}
            <section>
              <div className="flex items-center gap-3">
                <h2 className="font-heading text-xl font-bold text-ink">Stock Losers</h2>
                <span className="rounded-full bg-loss/10 px-2.5 py-0.5 text-[0.7rem] font-medium text-loss">Top {topLosers.length}</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {topLosers.map((q) => (
                  <StockRow key={q.symbol} quote={q} />
                ))}
              </div>
            </section>

            {/* Most Active */}
            <section>
              <div className="flex items-center gap-3">
                <h2 className="font-heading text-xl font-bold text-ink">Most Active</h2>
                <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[0.7rem] font-medium text-accent">By volatility</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {mostActive.map((q) => (
                  <StockRow key={q.symbol} quote={q} />
                ))}
              </div>
            </section>

            {/* Sectors */}
            <section>
              <h2 className="font-heading text-xl font-bold text-ink">Sectors</h2>
              <p className="mt-1 text-[0.85rem] text-ink-muted">
                {equityQuotes.length} stocks across {sectorMap.size} sectors
              </p>
              <div className="mt-6 space-y-8">
                {Array.from(sectorMap.entries())
                  .sort((a, b) => b[1].length - a[1].length)
                  .map(([sector, sectorQuotes]) => {
                    const avgChange =
                      sectorQuotes.reduce((s, q) => s + q.changePercent, 0) / sectorQuotes.length;
                    const sorted = [...sectorQuotes].sort(
                      (a, b) => b.previousClose - a.previousClose,
                    );

                    return (
                      <div key={sector}>
                        <div className="flex items-center gap-3">
                          <span
                            className="size-3 rounded-full"
                            style={{ backgroundColor: SECTOR_COLORS[sector] }}
                          />
                          <h3 className="font-heading text-lg font-semibold text-ink">{sector}</h3>
                          <span className="text-[0.78rem] text-ink-muted">{sectorQuotes.length} stocks</span>
                          <span
                            className={`tabular ml-auto rounded-full px-2.5 py-0.5 text-[0.72rem] font-semibold ${
                              avgChange >= 0
                                ? "bg-gain/10 text-gain"
                                : "bg-loss/10 text-loss"
                            }`}
                          >
                            Avg {avgChange >= 0 ? "+" : ""}{avgChange.toFixed(2)}%
                          </span>
                        </div>
                        <div className="mt-3 overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-border text-left text-[0.7rem] font-medium uppercase tracking-wider text-ink-muted">
                                <th className="py-2 pr-3">Company</th>
                                <th className="py-2 px-3 text-right">Price</th>
                                <th className="py-2 px-3 text-right">Change</th>
                                <th className="py-2 pl-3 text-right hidden sm:table-cell">Chart</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sorted.map((q) => (
                                <tr
                                  key={q.symbol}
                                  className="border-b border-border/50 transition-colors hover:bg-panel-raised"
                                >
                                  <td className="py-2.5 pr-3">
                                    <div className="flex items-center gap-2.5">
                                      <StockIcon symbol={q.symbol} size={26} />
                                      <div>
                                        <span className="text-[0.82rem] font-semibold text-ink">{q.symbol}</span>
                                        <span className="ml-2 text-[0.72rem] text-ink-muted">{q.name}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="tabular py-2.5 px-3 text-right text-[0.82rem] font-medium text-ink">
                                    {formatPrice(q.price)}
                                  </td>
                                  <td className="tabular py-2.5 px-3 text-right">
                                    <span
                                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[0.75rem] font-medium ${
                                        q.change >= 0
                                          ? "bg-gain/10 text-gain"
                                          : "bg-loss/10 text-loss"
                                      }`}
                                    >
                                      {formatPercent(q.changePercent)}
                                    </span>
                                  </td>
                                  <td className="py-2.5 pl-3 text-right hidden sm:table-cell">
                                    <Sparkline values={q.history} width={80} height={22} />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </section>

            {/* All Stocks Table */}
            <section>
              <h2 className="font-heading text-xl font-bold text-ink">All Stocks</h2>
              <p className="mt-1 text-[0.85rem] text-ink-muted">
                Complete list of {equityQuotes.length} tracked equities sorted by market weight
              </p>
              <div className="mt-4 overflow-x-auto rounded-card border border-border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-panel text-left text-[0.7rem] font-medium uppercase tracking-wider text-ink-muted">
                      <th className="py-3 pl-4 pr-2">#</th>
                      <th className="py-3 px-3">Company</th>
                      <th className="py-3 px-3 text-right">Price</th>
                      <th className="py-3 px-3 text-right">Change</th>
                      <th className="py-3 px-3 text-right hidden sm:table-cell">Prev Close</th>
                      <th className="py-3 px-3 text-center hidden md:table-cell">Sector</th>
                      <th className="py-3 px-3 text-right hidden lg:table-cell">Chart</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...equityQuotes]
                      .sort((a, b) => b.previousClose - a.previousClose)
                      .map((q, i) => {
                        const entry = WATCHLIST_UNIVERSE.find((s) => s.symbol === q.symbol);
                        return (
                          <tr
                            key={q.symbol}
                            className="border-b border-border/30 transition-colors hover:bg-panel-raised"
                          >
                            <td className="tabular py-2.5 pl-4 pr-2 text-[0.72rem] text-ink-muted">{i + 1}</td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2.5">
                                <StockIcon symbol={q.symbol} size={24} />
                                <div>
                                  <span className="text-[0.82rem] font-semibold text-ink">{q.symbol}</span>
                                  <span className="ml-2 text-[0.72rem] text-ink-muted hidden sm:inline">{q.name}</span>
                                </div>
                              </div>
                            </td>
                            <td className="tabular py-2.5 px-3 text-right text-[0.82rem] font-medium text-ink">
                              {formatPrice(q.price)}
                            </td>
                            <td className="tabular py-2.5 px-3 text-right">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[0.72rem] font-medium ${
                                  q.change >= 0
                                    ? "bg-gain/10 text-gain"
                                    : "bg-loss/10 text-loss"
                                }`}
                              >
                                {formatPercent(q.changePercent)}
                              </span>
                            </td>
                            <td className="tabular py-2.5 px-3 text-right text-[0.78rem] text-ink-muted hidden sm:table-cell">
                              {formatPrice(q.previousClose)}
                            </td>
                            <td className="py-2.5 px-3 text-center hidden md:table-cell">
                              {entry && (
                                <span
                                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-[0.65rem]"
                                >
                                  <span
                                    className="size-1.5 rounded-full"
                                    style={{ backgroundColor: SECTOR_COLORS[entry.sector] }}
                                  />
                                  {entry.sector}
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-right hidden lg:table-cell">
                              <Sparkline values={q.history} width={70} height={20} />
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {activeTab === "indices" && (
          <div className="mx-auto max-w-7xl px-6 py-10">
            <section>
              <h2 className="font-heading text-xl font-bold text-ink">Major US Indices</h2>
              <p className="mt-1 text-[0.85rem] text-ink-muted">
                Real-time performance of major market benchmarks
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {indexQuotes.map((q) => (
                  <div
                    key={q.symbol}
                    className="rounded-card border border-border bg-panel p-6 transition-all hover:border-border-strong"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[0.8rem] text-ink-muted">{q.symbol}</p>
                        <p className="mt-1 font-heading text-lg font-bold text-ink">{q.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="tabular text-xl font-bold text-ink">{formatPrice(q.price)}</p>
                        <div className="mt-1 flex items-center justify-end gap-2">
                          <span className={`tabular text-[0.85rem] font-medium ${q.change >= 0 ? "text-gain" : "text-loss"}`}>
                            {formatChange(q.change)}
                          </span>
                          <span
                            className={`tabular rounded-full px-2 py-0.5 text-[0.75rem] font-medium ${
                              q.change >= 0
                                ? "bg-gain/10 text-gain"
                                : "bg-loss/10 text-loss"
                            }`}
                          >
                            {formatPercent(q.changePercent)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Sparkline values={q.history} width={300} height={48} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Market hours info */}
        <section className="border-t border-border bg-panel py-12">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-8 sm:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent/10">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <h3 className="mt-3 font-heading text-base font-semibold text-ink">Market Hours</h3>
                <p className="mt-1 text-[0.82rem] text-ink-muted">NYSE/NASDAQ: 9:30 AM - 4:00 PM ET, Mon-Fri</p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent/10">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </div>
                <h3 className="mt-3 font-heading text-base font-semibold text-ink">Live Updates</h3>
                <p className="mt-1 text-[0.82rem] text-ink-muted">Prices update continuously during market hours via Finnhub API</p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent/10">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                </div>
                <h3 className="mt-3 font-heading text-base font-semibold text-ink">After Hours</h3>
                <p className="mt-1 text-[0.82rem] text-ink-muted">Cached data displayed when markets are closed, weekends, and holidays</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-ground py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-[0.78rem] text-ink-muted">
              &copy; {new Date().getFullYear()} LiveStocks by Khurram | All rights reserved. Not investment advice.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-[0.78rem] text-ink-muted transition-colors hover:text-ink">Privacy</Link>
              <Link href="/terms" className="text-[0.78rem] text-ink-muted transition-colors hover:text-ink">Terms</Link>
              <Link href="/disclaimer" className="text-[0.78rem] text-ink-muted transition-colors hover:text-ink">Disclaimer</Link>
            </div>
          </div>
        </div>
      </footer>

      <BackToTop />
    </div>
  );
}

function StockRow({ quote: q }: { quote: Quote }) {
  return (
    <div className="flex items-center justify-between rounded-card border border-border bg-panel px-4 py-3 transition-all hover:border-border-strong">
      <div className="flex items-center gap-2.5">
        <StockIcon symbol={q.symbol} size={30} />
        <div>
          <p className="text-[0.82rem] font-semibold text-ink">{q.symbol}</p>
          <p className="text-[0.68rem] text-ink-muted">{q.name}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="tabular text-[0.85rem] font-semibold text-ink">{formatPrice(q.price)}</p>
        <span
          className={`tabular inline-flex items-center rounded-full px-2 py-0.5 text-[0.72rem] font-medium ${
            q.change >= 0
              ? "bg-gain/10 text-gain"
              : "bg-loss/10 text-loss"
          }`}
        >
          {formatPercent(q.changePercent)}
        </span>
      </div>
    </div>
  );
}
