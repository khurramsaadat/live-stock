"use client";

import { useEffect, useState } from "react";

interface LandingProps {
  onLaunch: () => void;
}

export function Landing({ onLaunch }: LandingProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
            <a href="/markets" className="text-[0.9rem] text-ink-muted transition-colors hover:text-ink">Markets</a>
            <a href="#how-it-works" className="text-[0.9rem] text-ink-muted transition-colors hover:text-ink">How It Works</a>
            <a href="#faq" className="text-[0.9rem] text-ink-muted transition-colors hover:text-ink">FAQ</a>
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

      <main className="flex-1">
        {/* Hero */}
        <section className="hero-gradient relative flex min-h-[90vh] items-center justify-center pt-16">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <div className="reveal" style={{ "--reveal-delay": "0ms" } as React.CSSProperties}>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-panel px-4 py-1.5 text-[0.8rem] text-ink-muted">
                <span className="size-1.5 rounded-full bg-gain" />
                Real-time market data - Powered by Finnhub
              </span>
            </div>
            <h1
              className="reveal mt-8 font-heading text-5xl font-bold leading-[1.08] tracking-tight text-ink sm:text-6xl lg:text-7xl"
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

            {/* Live stock ticker preview cards */}
            <div
              className="reveal mx-auto mt-16 flex max-w-2xl flex-wrap items-center justify-center gap-3"
              style={{ "--reveal-delay": "320ms" } as React.CSSProperties}
            >
              {[
                { symbol: "AAPL", name: "Apple", price: "344.63", change: "-1.23%", logo: "/logos/apple.svg", loss: true },
                { symbol: "NVDA", name: "Nvidia", price: "204.64", change: "-4.22%", logo: "/logos/nvidia.svg", loss: true },
                { symbol: "MSFT", name: "Microsoft", price: "521.91", change: "-1.55%", logo: "/logos/microsoft.svg", loss: true },
                { symbol: "TSLA", name: "Tesla", price: "399.81", change: "-0.87%", logo: "/logos/tesla.svg", loss: true },
                { symbol: "AMZN", name: "Amazon", price: "240.35", change: "-1.41%", logo: "/logos/amazon.svg", loss: true },
              ].map((s) => (
                <div key={s.symbol} className="flex items-center gap-2.5 rounded-card border border-border bg-panel px-4 py-2.5 transition-colors hover:border-border-strong">
                  <span className="flex size-7 items-center justify-center rounded-full bg-white/10 overflow-hidden">
                    <img src={s.logo} alt="" width={18} height={18} className="object-contain" loading="lazy" />
                  </span>
                  <div className="text-left">
                    <span className="block text-[0.78rem] font-semibold">{s.symbol}</span>
                    <span className="tabular block text-[0.68rem] text-ink-muted">{s.name}</span>
                  </div>
                  <div className="ml-1 text-right">
                    <span className="tabular block text-[0.75rem] font-medium">{s.price}</span>
                    <span className={`tabular block text-[0.68rem] font-medium ${s.loss ? "text-loss" : "text-gain"}`}>{s.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative grid lines */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.03]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </section>

        {/* Stats bar */}
        <section className="border-y border-border bg-panel">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px sm:grid-cols-4">
            {[
              { value: "100+", label: "Stocks tracked" },
              { value: "4", label: "Major indices" },
              { value: "<1s", label: "Update latency" },
              { value: "100%", label: "Free to use" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1 py-8">
                <span className="font-heading text-2xl font-bold text-accent">{stat.value}</span>
                <span className="text-[0.8rem] text-ink-muted">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <span className="eyebrow">Features</span>
              <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Everything you need to stay informed
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-ink-secondary">
                Built for speed and clarity. No clutter, no noise - just the market data that matters.
              </p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
                  title: "Live Interactive Charts",
                  desc: "Full SVG charts with crosshair cursor, gradient fills, period selectors, and real-time price updates.",
                },
                {
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
                  title: "Performance Heatmap",
                  desc: "Treemap visualization with real company logos inside tiles. See market performance at a glance.",
                },
                {
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
                  title: "Stock Screener",
                  desc: "Table, Charts, and Heatmap views in one screener. Search, filter by gainers/losers, sort any column.",
                },
                {
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
                  title: "Watchlist Manager",
                  desc: "Track what matters. Add or remove symbols, sort by any column. Your list persists across sessions.",
                },
                {
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                  title: "Market Hours Aware",
                  desc: "Session badges and cached data. Charts always show data - even on weekends and after hours.",
                },
                {
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
                  title: "Real Company Logos",
                  desc: "100+ official stock logos displayed throughout - in the screener, heatmap, watchlist, and charts.",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-card border border-border bg-panel p-6 transition-all hover:border-border-strong hover:shadow-sm"
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
        <section id="markets" className="relative border-t border-border bg-panel py-24 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=60&auto=format')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative mx-auto max-w-6xl px-6">
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
                    "100+ individual equities tracked across 8 sectors",
                    "Add any US-listed stock to your watchlist",
                    "Automatic reconnection with exponential backoff",
                    "24-hour local cache for offline access",
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

        {/* How It Works */}
        <section id="how-it-works" className="border-t border-border py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <span className="eyebrow">How It Works</span>
              <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Up and running in seconds
              </h2>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Launch the app",
                  desc: "Click the button above. No sign-up, no email, no credit card. The dashboard opens instantly.",
                },
                {
                  step: "2",
                  title: "Customize your watchlist",
                  desc: "Add or remove stocks from 100+ pre-loaded symbols. Your changes are saved locally in your browser.",
                },
                {
                  step: "3",
                  title: "Explore the data",
                  desc: "Switch between Dashboard, Screener, Watchlist, Heatmap, and Charts tabs. All powered by live data.",
                },
              ].map((item) => (
                <div key={item.step} className="relative rounded-card border border-border bg-panel p-6 text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent font-heading text-xl font-bold text-ground">
                    {item.step}
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-[0.85rem] leading-relaxed text-ink-muted">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Logos/stocks banner */}
        <section className="border-y border-border bg-panel py-10 overflow-hidden">
          <p className="mb-8 text-center text-[0.8rem] font-medium uppercase tracking-widest text-ink-muted">
            Tracking the world&apos;s biggest companies
          </p>
          <LogoMarquee />
        </section>

        {/* FAQ */}
        <section id="faq" className="border-t border-border py-24">
          <div className="mx-auto max-w-3xl px-6">
            <div className="text-center">
              <span className="eyebrow">FAQ</span>
              <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Frequently asked questions
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-base text-ink-secondary">
                Everything you need to know before getting started.
              </p>
            </div>

            <div className="mt-12 space-y-3">
              {[
                {
                  q: "Is this really free? Are there hidden charges?",
                  a: "100% free. No sign-up required, no credit card, no premium tier. LiveStocks is an open-source project. Market data is provided by Finnhub's free API tier.",
                },
                {
                  q: "Do I need to create an account?",
                  a: "No. There is no account system. Just open the app and start tracking. Your watchlist and preferences are saved in your browser's local storage.",
                },
                {
                  q: "Is this real-time data or delayed?",
                  a: "Prices come from Finnhub's real-time API. During market hours, quotes update continuously. After hours and on weekends, the dashboard shows the last known prices from its local cache.",
                },
                {
                  q: "Will I lose my watchlist if I clear my browser?",
                  a: "Your watchlist is stored in localStorage. Clearing browser data will reset it to defaults. We recommend bookmarking the app and avoiding aggressive cache clearing.",
                },
                {
                  q: "Can I use this for actual trading decisions?",
                  a: "LiveStocks is a monitoring tool, not a trading platform. It does not provide buy/sell recommendations, financial advice, or order execution. Always consult a licensed professional.",
                },
                {
                  q: "Does it work on mobile?",
                  a: "Yes. The dashboard is fully responsive and works on phones and tablets. Charts, heatmaps, and the screener all adapt to smaller screens.",
                },
                {
                  q: "How many stocks can I track?",
                  a: "The app comes pre-loaded with 100+ stocks across 8 sectors including mega-caps like Apple, Nvidia, Microsoft, Amazon, and Tesla. You can add any US-listed symbol to your watchlist.",
                },
                {
                  q: "What if the data stops updating?",
                  a: "The app has automatic reconnection with exponential backoff. If Finnhub is temporarily down, the dashboard continues showing cached data. A status pill in the header shows the connection state.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-card border border-border bg-panel transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-panel-raised"
                  >
                    <span className="text-[0.95rem] font-medium text-ink">{item.q}</span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`shrink-0 text-ink-muted transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <div
                    className={`grid transition-all duration-200 ${
                      openFaq === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 text-[0.9rem] leading-relaxed text-ink-muted">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative border-t border-border bg-panel py-24 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&q=60&auto=format')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Ready to track the markets?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-ink-secondary">
              No sign-up. No fees. No nonsense. Just open the app and start watching.
            </p>
            <button
              type="button"
              onClick={onLaunch}
              className="mt-10 rounded-full bg-accent px-10 py-4 text-lg font-semibold text-ground transition-all hover:brightness-110 hover:shadow-lg hover:shadow-accent/20"
            >
              Launch Dashboard
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-ground py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Logo />
              <p className="mt-4 max-w-xs text-[0.85rem] leading-relaxed text-ink-muted">
                A real-time stock market dashboard built with Next.js, React, and Tailwind CSS.
                Powered by Finnhub API. Open source and free to use.
              </p>
              {/* Social icons */}
              <div className="mt-5 flex items-center gap-3">
                <a href="https://github.com/khurramsaadat" target="_blank" rel="noopener noreferrer" className="flex size-9 items-center justify-center rounded-full border border-border text-ink-muted transition-colors hover:border-border-strong hover:text-ink" aria-label="GitHub">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>
                <a href="https://linkedin.com/in/khurramsaadat" target="_blank" rel="noopener noreferrer" className="flex size-9 items-center justify-center rounded-full border border-border text-ink-muted transition-colors hover:border-border-strong hover:text-ink" aria-label="LinkedIn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="flex size-9 items-center justify-center rounded-full border border-border text-ink-muted transition-colors hover:border-border-strong hover:text-ink" aria-label="X (Twitter)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-[0.8rem] font-semibold uppercase tracking-wide text-ink-secondary">Product</h4>
              <ul className="mt-4 space-y-2.5">
                <li><a href="#features" className="text-[0.85rem] text-ink-muted transition-colors hover:text-ink">Features</a></li>
                <li><a href="/markets" className="text-[0.85rem] text-ink-muted transition-colors hover:text-ink">Markets</a></li>
                <li><a href="#how-it-works" className="text-[0.85rem] text-ink-muted transition-colors hover:text-ink">How It Works</a></li>
                <li><a href="#faq" className="text-[0.85rem] text-ink-muted transition-colors hover:text-ink">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[0.8rem] font-semibold uppercase tracking-wide text-ink-secondary">Legal</h4>
              <ul className="mt-4 space-y-2.5">
                <li><a href="/privacy" className="text-[0.85rem] text-ink-muted transition-colors hover:text-ink">Privacy Policy</a></li>
                <li><a href="/terms" className="text-[0.85rem] text-ink-muted transition-colors hover:text-ink">Terms of Service</a></li>
                <li><a href="/disclaimer" className="text-[0.85rem] text-ink-muted transition-colors hover:text-ink">Disclaimer</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[0.8rem] font-semibold uppercase tracking-wide text-ink-secondary">Connect</h4>
              <ul className="mt-4 space-y-2.5">
                <li><a href="https://github.com/khurramsaadat" target="_blank" rel="noopener noreferrer" className="text-[0.85rem] text-ink-muted transition-colors hover:text-ink">GitHub</a></li>
                <li><a href="https://linkedin.com/in/khurramsaadat" target="_blank" rel="noopener noreferrer" className="text-[0.85rem] text-ink-muted transition-colors hover:text-ink">LinkedIn</a></li>
                <li><a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-[0.85rem] text-ink-muted transition-colors hover:text-ink">X (Twitter)</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-border pt-6">
            <p className="text-[0.78rem] text-ink-muted">
              &copy; {new Date().getFullYear()} LiveStocks by Khurram | All rights reserved. Not investment advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const MARQUEE_LOGOS = [
  "/logos/apple.svg",
  "/logos/nvidia.svg",
  "/logos/microsoft.svg",
  "/logos/alphabet.svg",
  "/logos/amazon.svg",
  "/logos/meta-platforms.svg",
  "/logos/tesla.svg",
  "/logos/jpmorgan-chase.svg",
  "/logos/visa.svg",
  "/logos/walmart.svg",
  "/logos/coca-cola.svg",
  "/logos/disney.svg",
  "/logos/boeing.svg",
  "/logos/pfizer.svg",
  "/logos/uber.svg",
  "/logos/netflix.svg",
  "/logos/mastercard.svg",
  "/logos/salesforce.svg",
  "/logos/adobe.svg",
  "/logos/oracle.svg",
  "/logos/eli-lilly.svg",
  "/logos/broadcom.svg",
  "/logos/goldman-sachs.svg",
  "/logos/costco-wholesale.svg",
  "/logos/home-depot.svg",
  "/logos/caterpillar.svg",
  "/logos/nike.svg",
  "/logos/starbucks.svg",
  "/logos/paypal.svg",
  "/logos/crowdstrike.svg",
];

function LogoMarquee() {
  return (
    <div className="relative">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-panel to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-panel to-transparent" />

      <div className="flex gap-12 logo-scroll">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center gap-12 logo-scroll-track" aria-hidden={copy === 1}>
            {MARQUEE_LOGOS.map((logo) => (
              <img
                key={`${copy}-${logo}`}
                src={logo}
                alt=""
                width={44}
                height={44}
                className="shrink-0 object-contain opacity-70 transition-opacity duration-200 hover:opacity-100"
                loading="lazy"
              />
            ))}
          </div>
        ))}
      </div>
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
