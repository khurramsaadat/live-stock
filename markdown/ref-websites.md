# Competitive Reference - Live Stock Dashboard Websites

Research date: November 1, 2026

---

## 1. TradingView

**URL:** [tradingview.com](https://www.tradingview.com)
**Tagline:** "Where the world does markets"
**Users:** 100M+ traders and investors

### Key Features

- Up to 16 synchronized charts per screen (symbols, timeframes, drawings all linked)
- 400+ built-in indicators, 100K+ community indicators, 110+ drawing tools
- Multi-timeframe analysis with candlestick pattern recognition
- Customizable layouts and templates saved per user
- Tab groups with persistent workspace settings (broker, drawing toolbar, panel sizes)
- Command search for fast navigation
- Web Component widgets (Ticker Tape, Mini Chart, Heatmap, Screener, Economic Calendar) embeddable on external sites
- Desktop app with multi-monitor support
- Alerts system with complex technical/fundamental conditions

### Design Language

- Dark charcoal background with chart-center layout
- Fixed left toolbar for drawing tools, top bar for timeframe/indicators
- Right rail for watchlist and symbol details
- Swipe actions on watchlist rows for quick chart, alert, delete
- Theme builder exports plain CSS tokens for consistent styling

### Pricing

- Free tier with basic features
- Paid plans unlock more charts, indicators, alerts, and data

### Takeaways for Live Stocks

- **Linked widgets** - selecting a symbol in the watchlist could update a detail view or chart
- **Keyboard shortcuts** - power users expect hotkeys for navigation
- **Alerts** - even simple price-cross alerts add stickiness
- **Embeddable widgets** - Mini Chart and Ticker Tape are high-value components

---

## 2. Yahoo Finance

**URL:** [finance.yahoo.com](https://finance.yahoo.com)
**Tagline:** "#1 consumer finance property"
**Users:** 90M+ monthly US visitors

### Key Features

- Customizable dock (command center) that follows you across every page
- Advanced charts with 25+ chart types and 100+ customizable indicators
- Compare mode - side-by-side view of up to 4 companies (price, revenue, cash flows, trading stats)
- Sector and industry pages with ETF/mutual fund suggestions
- 360-degree portfolio view linking 401K, IRA, savings, trading accounts
- Transaction management with FIFO lot tracking
- Earnings calendar, dividend tracking
- Stock screeners (pre-built and custom)
- Curated news hub with reduced ads (40% fewer than before)

### Design Language

- Clean white/light background with blue accents
- Persistent right-rail dock with real-time data
- Drag-to-rearrange dock widgets
- Green/red semantic colors for gains/losses
- High-contrast quote pages with clear data hierarchy

### Pricing

- Free with ads
- Yahoo Finance Plus for premium research and advanced data

### Takeaways for Live Stocks

- **Persistent dock/sidebar** - a sticky sidebar that travels with the user is powerful UX
- **Compare mode** - side-by-side stock comparison is a differentiator
- **Fewer ads, more focus** - validates our ad-free approach
- **Portfolio linking** - even without trading, showing a portfolio value adds depth

---

## 3. Finviz

**URL:** [finviz.com](https://finviz.com)
**Tagline:** "Bloomberg for novices"
**Users:** Millions of traders and investors

### Key Features

- S&P 500 heatmap - all 500 stocks on one screen, grouped by sector/industry
  - Tile size = market cap, color = performance (green/red)
  - Click to zoom, double-click for stock detail
  - Switchable metrics: 1D, 1W, 1M, 6M, 1Y, dividends, P/E
- New map types: Market Cap, 52-Week High/Low, Insider Trading, Themes
- Stock screener with 60+ filter criteria (fundamental + technical)
- Multiple views: overview, valuation, financial, ownership, performance, technical, charts
- Saved filter presets for fast workflow
- Sector/industry/country group performance views
- Homepage customization (Elite): filters, auto-refresh, session data, two simultaneous maps
- Commodities, bonds, forex, crypto all on the front page

### Design Language

- Dense, data-rich layout (information density is a feature, not a bug)
- Treemap heatmap as the signature visual
- Minimal chrome, maximum data surface
- Fast page loads, instant filter updates
- Color-coded performance everywhere

### Pricing

- Free with banner ads and 15-min delayed data
- Elite: real-time data, advanced screener, custom homepage, backtesting

### Takeaways for Live Stocks

- **Heatmap visualization** - a treemap of watchlist performance would be a killer feature
- **Screener with saved presets** - our search is basic; filters would add power
- **Performance across timeframes** - showing 1D, 1W, 1M, YTD would add context
- **Information density** - our design is clean but could show more data per row

---

## 4. Robinhood

**URL:** [robinhood.com](https://robinhood.com)
**Tagline:** "Powerful, agile trading"
**Users:** Millions of retail investors

### Key Features

- Portfolio chart with draggable scrubber (touch-first interaction)
- Watchlist with custom lists, drag-to-reorder, sparkline per row
- Swipeable notification cards (features, account updates, market movers, news)
- Pending order indicators (+/-) on watchlist rows
- iOS home screen widgets (portfolio value, holdings, lists)
- Legend (desktop terminal): widget-based layout, dynamically linked panels, multi-monitor
- Buy/sell chips directly on chart

### Design Language

| Token | Value |
|---|---|
| Ground | `#000000` pure black |
| Panel | `#151719` charcoal |
| Text | `#FFFFFF`, secondary `#BFBFBF`, muted `#808080` |
| Accent | `#CCFF00` chartreuse |
| Semantic | Green up / red down |
| Display type | Martina Plantijn (serif) for headlines |
| UI type | Capsule Sans Text (geometric sans) for body |
| Buttons | Pill shape, 36px radius |
| Motion | Restrained; scroll-reveal, numeric counters |

- Dense but padded (16-24px); hierarchy from type weight and single accent color
- Chart scrubber is the hero interaction - drag across chart to see price at any point
- Color floods the background to signal market open/closed
- Cards pattern for information grouping

### Pricing

- Free trading (revenue from payment for order flow)
- Gold membership for premium features

### Takeaways for Live Stocks

- **Chart scrubber** - draggable time cursor on sparklines would feel premium
- **Single accent color** - our amber accent is already doing this well
- **Cards for status** - swipeable cards for market alerts/news
- **Background color shift** - market open/closed could tint the entire UI
- **Drag-to-reorder** watchlist items

---

## 5. Koyfin

**URL:** [koyfin.com](https://www.koyfin.com)
**Tagline:** "Comprehensive financial data analysis"

### Key Features

- Fully customizable dashboards with drag-and-drop, resizable widgets
- Dashboard groups - linked widgets (select ticker in table, all charts update)
- 7 color groups for widget linking
- Custom financial analysis templates (300+ data points)
- Equity screener with 5,900+ filter criteria across 100K+ global securities
- Macro dashboards: World Equity, Sectors, Factors, Yields, IPOs, Currencies, Commodities
- World Economic Calendar with per-country data
- Watchlist views (My Views) - saved column configurations reusable across dashboards
- Chart templates with historical graphing (the "G" chart)
- Relative performance charts (A/B comparison)
- Custom formulas and calculations
- Watchlist sharing between users
- Mobile app (compact version of web)
- Keyboard hotkeys for every feature (2-3 letter abbreviations)
- Themeable interface with color customization

### Design Language

- Bloomberg-inspired density with modern polish
- Dark and light themes with custom color options
- Widget-based canvas layout (similar to a tiling window manager)
- Sidebar navigation with hotkey hints
- Consistent data tables with sortable columns

### Pricing

- Free: 2 watchlists, 2 screens, 2 custom dashboards, 2Y financials
- Plus ($25/mo): 10 watchlists, 10 dashboards, 10Y data
- Pro ($50/mo): unlimited everything, priority support

### Takeaways for Live Stocks

- **Widget-based dashboard** - drag-and-drop layout is the gold standard
- **Dashboard groups** - linked widgets that update together
- **Keyboard hotkeys** - every feature accessible via keyboard
- **Saved views** - column configurations that persist
- **Macro dashboards** - pre-built market overview pages

---

## Feature Comparison Matrix

| Feature | TradingView | Yahoo Finance | Finviz | Robinhood | Koyfin | Live Stocks |
|---|---|---|---|---|---|---|
| Real-time quotes | Yes | Yes | 15min (free) | Yes | Yes | Yes (Finnhub) |
| Watchlist | Yes | Yes | No | Yes | Yes | Yes |
| Sparklines | Mini charts | No | No | Yes | No | Yes |
| Heatmap | Yes | No | Yes (signature) | No | No | No |
| Screener | Yes | Yes | Yes (60+ filters) | No | Yes (5900+) | No |
| Alerts | Yes | Yes | Yes | Yes | No | No |
| Custom dashboards | Yes | Dock widgets | No | No | Yes | No |
| Dark theme | Yes | No | No | Yes | Yes | Yes |
| Keyboard shortcuts | Yes | Minimal | No | No | Yes | No |
| Desktop app | Yes (Electron) | No | No | Yes | No | Yes (Tauri) |
| Portfolio tracking | Via broker | Yes | No | Yes | Yes | No |
| Compare mode | Yes | Yes (4 stocks) | Side-by-side | No | Yes (A/B) | No |
| Market session indicator | Yes | No | No | Yes (bg color) | No | Yes |
| Mobile responsive | Yes | Yes | Limited | App-first | Yes | Partial |
| Free tier | Yes | Yes | Yes | Yes | Yes | Yes |

---

## Actionable Improvements for Live Stocks (Implementable Now)

These are changes that fit within the current architecture - no new APIs, no backend, no database. All are front-end only and can ship today.

### Priority 1 - Quick Wins (< 1 hour each)

#### 1. Use Finnhub's `previousClose` instead of hardcoded values
The Finnhub adapter already captures `quote.pc` (previous close) and sends it as `update.previousClose`, but `use-market-feed.ts` ignores it. The change percentages currently compare live prices against stale fixtures in `universe.ts`, producing wildly inaccurate numbers (e.g., AMD showing +135% when the real daily change is -4%). This is the single highest-impact fix.

#### 2. Keyboard shortcuts
Add basic hotkeys that power users expect:
- `/` or `Ctrl+K` to focus the symbol search
- `Escape` to close dropdowns
- `1-4` to sort by column
- `D` to toggle dark/light theme
Every competitor (TradingView, Koyfin, Robinhood Legend) offers keyboard navigation.

#### 3. Drag-to-reorder watchlist
Robinhood and Yahoo Finance both let users drag symbols to reorder their watchlist. The watchlist is already persisted in localStorage, so adding drag handles with native HTML drag-and-drop is straightforward.

#### 4. Market session background tinting
Robinhood shifts the entire background color when the market is closed. Our `SessionBadge` already tracks open/pre/after/closed states. A subtle paper color shift (slightly warmer when closed, neutral when open) would add atmospheric feedback.

### Priority 2 - Medium Effort (1-3 hours each)

#### 5. Ticker tape / marquee strip
TradingView's most popular embedded widget. A scrolling horizontal strip at the top or bottom showing all tracked symbols with live price and change. CSS animation only, no new data needed.

#### 6. Mini chart tooltip on hover
When hovering over a row in the watchlist table, show a larger sparkline or a mini price chart in a tooltip/popover. Finviz, TradingView, and Koyfin all do this. We already render sparklines in the table - scaling one up in a popover is minimal work.

#### 7. Symbol detail panel (right rail expansion)
When clicking a symbol in the watchlist, expand the right rail (currently "Market pulse") to show a detail view: larger sparkline, day range bar, O/H/L/C values, and the Finnhub-provided metrics. This mirrors TradingView's right rail and Koyfin's linked widgets.

#### 8. Multi-timeframe change display
Show 1D, 1W, 1M change in the watchlist table (or on hover). The mock feed generates enough history for 1D. For live feeds, cache price snapshots in localStorage to compute multi-day changes. Yahoo Finance and Finviz both show multi-period performance.

#### 9. Performance heatmap widget
A small treemap in the Market Pulse rail showing all tracked symbols as colored rectangles (green/red by change, sized by previous close as a proxy for "importance"). Finviz's heatmap is its most recognizable feature. An SVG treemap is ~80 lines of code.

#### 10. Watchlist groups / multiple lists
Koyfin and Yahoo Finance both support multiple named watchlists. Our localStorage-based persistence already works - extend it to support named lists with a tab bar above the table.

### Priority 3 - Bigger Features (half day each)

#### 11. Price alerts (browser notifications)
TradingView, Yahoo Finance, and StockCharts all offer alerts. Using the browser Notification API + our existing feed, we can fire a notification when a tracked symbol crosses a user-defined price level. Alert rules stored in localStorage.

#### 12. Compare mode
Yahoo Finance's compare mode (up to 4 stocks side-by-side) is unique and valuable. Show overlaid sparklines normalized to a common baseline, with a toggle to compare price, change %, or relative performance.

#### 13. Full chart view
When clicking a sparkline, expand it into a full-width chart with time axis, crosshair cursor, and price/time readout on hover. This is the chart scrubber interaction from Robinhood. No charting library needed - extend the existing SVG sparkline.

#### 14. Command palette
TradingView and Koyfin both have command search. A `Ctrl+K` palette that lets users search symbols, toggle theme, reset watchlist, or jump to a section. Lightweight and high-impact for keyboard users.

#### 15. Exportable watchlist
Let users export their watchlist as CSV or share a URL with encoded symbols. Koyfin supports watchlist sharing; we can do a simpler version with URL query params.

---

## Design Principles Observed Across All 5 Sites

1. **Data density is a feature** - Financial users want more data per pixel, not less. White space is good but empty space is wasted.
2. **Green/red is universal** - Every site uses green for gains, red for losses. Our emerald/rust palette is the right call.
3. **Monospace for numbers** - Every competitor uses tabular/monospace figures for prices and changes. Our IBM Plex Mono choice is correct.
4. **Dark theme is expected** - 4 of 5 competitors default to or prominently offer dark mode. Financial users often prefer it.
5. **Keyboard shortcuts are table stakes** - Power users in finance live on the keyboard. Every serious platform offers them.
6. **Sparklines in watchlist rows** - TradingView, Robinhood, and our app all do this. It's the right pattern.
7. **Session awareness** - Showing market open/closed state is a differentiator that only we and Robinhood do well.
8. **Single accent color** - Robinhood (chartreuse), us (amber), TradingView (blue). One accent color creates visual coherence.
