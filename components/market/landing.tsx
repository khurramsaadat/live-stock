"use client";

import { useEffect, useState } from "react";

interface LandingProps {
  onLaunch: () => void;
}

export function Landing({ onLaunch }: LandingProps) {
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

  return (
    <div className="flex min-h-screen flex-col bg-ground">
      {/* Header */}
      <header className="fixed top-0 z-40 w-full border-b border-border/50 bg-ground/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-[0.9rem] text-ink-muted transition-colors hover:text-ink">Features</a>
            <a href="#markets" className="text-[0.9rem] text-ink-muted transition-colors hover:text-ink">Markets</a>
            <a href="#tools" className="text-[0.9rem] text-ink-muted transition-colors hover:text-ink">Tools</a>
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
            <button
              type="button"
              onClick={onLaunch}
              className="rounded-full bg-accent px-5 py-2.5 text-[0.85rem] font-semibold text-ground transition-all hover:brightness-110"
            >
              Open App
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="hero-gradient relative flex min-h-[85vh] items-center justify-center pt-16">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <div className="reveal" style={{ "--reveal-delay": "0ms" } as React.CSSProperties}>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-panel px-4 py-1.5 text-[0.8rem] text-ink-muted">
                <span className="size-1.5 rounded-full bg-gain" />
                Real-time market data
              </span>
            </div>
            <h1
              className="reveal mt-8 font-heading text-5xl font-bold leading-[1.1] tracking-tight text-ink sm:text-6xl lg:text-7xl"
              style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
            >
              Track markets<br />
              with <span className="text-accent">precision</span>
            </h1>
            <p
              className="reveal mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-secondary sm:text-xl"
              style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
            >
              Monitor stocks, indices, and your watchlist in one place.
              Interactive charts, heatmaps, and a stock screener - all powered by live data.
            </p>
            <div
              className="reveal mt-10 flex flex-wrap items-center justify-center gap-4"
              style={{ "--reveal-delay": "240ms" } as React.CSSProperties}
            >
              <button
                type="button"
                onClick={onLaunch}
                className="rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-ground transition-all hover:brightness-110 hover:shadow-lg hover:shadow-accent/20"
              >
                Launch Dashboard
              </button>
              <a
                href="#features"
                className="rounded-full border border-border px-8 py-3.5 text-base font-medium text-ink transition-colors hover:bg-panel-raised"
              >
                Learn more
              </a>
            </div>

            {/* Ticker preview */}
            <div
              className="reveal mx-auto mt-16 flex max-w-lg items-center justify-center gap-6"
              style={{ "--reveal-delay": "320ms" } as React.CSSProperties}
            >
              {[
                { symbol: "AAPL", price: "344.63", change: "-1.23%" },
                { symbol: "NVDA", price: "204.64", change: "-4.22%" },
                { symbol: "MSFT", price: "521.91", change: "-1.55%" },
              ].map((s) => (
                <div key={s.symbol} className="flex items-center gap-2.5 rounded-card border border-border bg-panel px-4 py-2.5">
                  <span className="flex size-7 items-center justify-center rounded-full bg-accent/10 text-[0.65rem] font-bold text-accent">
                    {s.symbol.charAt(0)}
                  </span>
                  <div>
                    <span className="block text-[0.78rem] font-semibold">{s.symbol}</span>
                    <span className="tabular block text-[0.7rem] text-ink-muted">{s.price}</span>
                  </div>
                  <span className="tabular ml-1 text-[0.72rem] font-medium text-loss">{s.change}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t border-border py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <span className="eyebrow">Features</span>
              <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Everything you need to stay informed
              </h2>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                  ),
                  title: "Live Charts",
                  desc: "Interactive SVG charts with crosshair cursor, gradient fills, and real-time price updates from Finnhub.",
                },
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  ),
                  title: "Performance Heatmap",
                  desc: "Visualize your entire watchlist at a glance with a squarified treemap colored by daily performance.",
                },
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                  ),
                  title: "Stock Screener",
                  desc: "Filter and sort through your tracked stocks. Search by symbol or name, filter by gainers or losers.",
                },
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  ),
                  title: "Watchlist Manager",
                  desc: "Track what matters. Add or remove symbols, sort by any column, and persist your list across sessions.",
                },
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  ),
                  title: "Market Hours Aware",
                  desc: "Session badges, live/closed indicators, and cached data that shows last-known prices when markets are shut.",
                },
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/></svg>
                  ),
                  title: "Dark and Light Themes",
                  desc: "Switch seamlessly between dark and light themes. Your preference is saved and applied instantly.",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-card border border-border bg-panel p-6 transition-colors hover:border-border-strong"
                >
                  <div className="flex size-11 items-center justify-center rounded-card bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-ground">
                    {feature.icon}
                  </div>
                  <h3 className="mt-4 font-heading text-base font-semibold text-ink">{feature.title}</h3>
                  <p className="mt-2 text-[0.85rem] leading-relaxed text-ink-muted">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Markets */}
        <section id="markets" className="border-t border-border bg-panel py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <span className="eyebrow">Market Data</span>
                <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-ink">
                  Powered by Finnhub
                </h2>
                <p className="mt-4 text-base leading-relaxed text-ink-secondary">
                  Real-time equity quotes from the Finnhub API. Every price update
                  is cached locally so your dashboard always has data - even on
                  weekends and after hours.
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    "S&P 500, Nasdaq, Dow Jones, Russell 2000 indices",
                    "11+ individual equities tracked by default",
                    "Add any US-listed stock to your watchlist",
                    "Automatic reconnection with exponential backoff",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[0.9rem] text-ink-secondary">
                      <svg className="mt-0.5 shrink-0 text-accent" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "S&P 500", value: "6,842.31", symbol: "^GSPC" },
                  { label: "Nasdaq", value: "23,418.57", symbol: "^IXIC" },
                  { label: "Dow Jones", value: "51,770.31", symbol: "^DJI" },
                  { label: "Russell 2000", value: "2,811.84", symbol: "^RUT" },
                ].map((idx) => (
                  <div key={idx.symbol} className="rounded-card border border-border bg-panel-raised p-5">
                    <p className="eyebrow">{idx.label}</p>
                    <p className="tabular mt-2 text-xl font-semibold">{idx.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tools */}
        <section id="tools" className="border-t border-border py-24">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <span className="eyebrow">Tools</span>
            <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-ink">
              Five views, one app
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-ink-secondary">
              Dashboard, Screener, Watchlist, Heatmap, and Charts - each tab gives you
              a different lens on the same live data feed.
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-3">
              {["Dashboard", "Screener", "Watchlist", "Heatmap", "Charts"].map((tab) => (
                <span
                  key={tab}
                  className="rounded-full border border-border bg-panel px-5 py-2.5 text-[0.85rem] font-medium text-ink-secondary"
                >
                  {tab}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={onLaunch}
              className="mt-12 rounded-full bg-accent px-10 py-4 text-lg font-semibold text-ground transition-all hover:brightness-110 hover:shadow-lg hover:shadow-accent/20"
            >
              Launch Dashboard
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-panel py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Logo />
              <p className="mt-4 max-w-xs text-[0.85rem] leading-relaxed text-ink-muted">
                A real-time stock market dashboard built with Next.js, React, and Tailwind CSS.
                Powered by Finnhub API.
              </p>
            </div>
            <div>
              <h4 className="text-[0.8rem] font-semibold uppercase tracking-wide text-ink-secondary">Product</h4>
              <ul className="mt-4 space-y-2.5">
                <li><a href="#features" className="text-[0.85rem] text-ink-muted transition-colors hover:text-ink">Features</a></li>
                <li><a href="#markets" className="text-[0.85rem] text-ink-muted transition-colors hover:text-ink">Markets</a></li>
                <li><a href="#tools" className="text-[0.85rem] text-ink-muted transition-colors hover:text-ink">Tools</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[0.8rem] font-semibold uppercase tracking-wide text-ink-secondary">Legal</h4>
              <ul className="mt-4 space-y-2.5">
                <li><span className="text-[0.85rem] text-ink-muted">Privacy Policy</span></li>
                <li><span className="text-[0.85rem] text-ink-muted">Terms of Service</span></li>
                <li><span className="text-[0.85rem] text-ink-muted">Disclaimer</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[0.8rem] font-semibold uppercase tracking-wide text-ink-secondary">Connect</h4>
              <ul className="mt-4 space-y-2.5">
                <li><span className="text-[0.85rem] text-ink-muted">GitHub</span></li>
                <li><span className="text-[0.85rem] text-ink-muted">LinkedIn</span></li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-border pt-6">
            <p className="text-[0.78rem] text-ink-muted">
              &copy; {new Date().getFullYear()} Live Stocks by Khurram | All rights reserved. Not investment advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-8 items-center justify-center rounded-lg bg-accent">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      </div>
      <span className="font-heading text-lg font-bold tracking-tight text-ink">
        LiveStocks
      </span>
    </div>
  );
}
