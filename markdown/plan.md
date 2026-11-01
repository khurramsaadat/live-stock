# Live Stocks - Build Plan

## Vision

A premium dark stock dashboard inspired by Robinhood's visual identity and TradingView's data density. Landing page with hero, features, and CTA. Tabbed app layout with real-time data from Finnhub. Screener, charts, heatmap, watchlist, and dashboard views.

---

## Build Stages

### Stage 1 - Design System + Layout Shell - DONE
- [x] CSS theme (Robinhood palette: #000 ground, #CCFF00 accent, #00C805 gain, #FF5000 loss)
- [x] Dark/light theme toggle with localStorage persistence
- [x] Tab navigation (Dashboard, Screener, Watchlist, Heatmap, Charts)
- [x] Header with logo + tabs + session clock + status pill + theme toggle
- [x] Scrolling ticker tape (all symbols, auto-scroll, pause on hover)
- [x] Footer

### Stage 2 - Data Layer - DONE
- [x] Finnhub adapter with previousClose fix
- [x] localStorage price cache (24h TTL) for offline/weekend viewing
- [x] Hydration-safe cache loading (useEffect, not useState initializer)
- [x] Safe fallback for HMR state shape changes

### Stage 3 - Dashboard Tab - DONE
- [x] Index cards row (4 cards with sparklines, clickable)
- [x] Top Gainers / Top Losers sections with stock icons
- [x] Most Active section
- [x] Market Breadth (advancing/declining bar + performance spread)
- [x] Click any stock to navigate to Charts tab

### Stage 4 - Screener Tab - DONE
- [x] Full table with stock icons, sparklines, price, change%, change
- [x] Search filter (by symbol or name)
- [x] Gainers/Losers/All filter pills
- [x] Sortable columns (symbol, price, change%, prev close)
- [x] Click row to navigate to Charts tab

### Stage 5 - Watchlist Tab - DONE
- [x] Sortable table with sparklines, tick-up/tick-down flash
- [x] Search combobox + Track button
- [x] Clickable symbol names (navigate to chart)
- [x] Reset to default button
- [ ] Drag-to-reorder (future)
- [ ] Multiple named watchlists (future)

### Stage 6 - Heatmap Tab - DONE
- [x] Squarified treemap (SVG) sized by previousClose
- [x] Green/red fill by changePercent
- [x] Hover tooltip, click to navigate to chart
- [x] Fixed coordinate bug in squarify algorithm

### Stage 7 - Charts Tab - DONE
- [x] Full-width SVG chart with gradient area fill
- [x] Y-axis price labels, previous close dashed line
- [x] Crosshair cursor with price label on both axes
- [x] Period selector (1D, 5D, 1M, ALL)
- [x] Stats grid (Price, Change, Change %, High, Low, Prev Close)
- [x] Simulated curve when only 1 data point available
- [x] "Last close" badge when market is closed
- [x] Pulsing endpoint dot

### Stage 8 - Landing Page - DONE
- [x] Fixed header with nav + "Open App" button
- [x] Hero section with gradient, headline, CTA
- [x] Features grid (6 cards)
- [x] Market Data section with index preview cards
- [x] Tools section with tab pills + CTA
- [x] 5-column footer with copyright
- [x] Landing/App state persisted in localStorage

### Stage 9 - Typography and Design Overhaul - DONE
- [x] Replaced Instrument Serif with Space Grotesk for headings
- [x] Replaced Instrument Sans with Inter for body
- [x] Added stock icon avatars (colored circles with letter)
- [x] Bigger tab buttons and UI elements
- [x] Better logo (chartreuse icon + Space Grotesk "LiveStocks")

### Stage 10 - Interactivity - DONE
- [x] Click any stock from any tab to navigate to its chart
- [x] Keyboard shortcuts (Alt+1-5 for tabs, Escape to close modal)
- [x] Stock detail modal overlay
- [x] Back to top button
- [x] Backdrop click to dismiss modal

### Stage 11 - Future
- [ ] Drag-to-reorder watchlist
- [ ] Multiple named watchlists
- [ ] Fix TwelveData adapter for live index data
- [ ] Mobile responsive fine-tuning
- [ ] Price alerts (browser notifications)
- [ ] Compare mode overlay

---

## Design System

### Fonts
- **Headings**: Space Grotesk (600 weight, tight tracking)
- **Body/UI**: Inter (clean, modern sans-serif)
- **Numbers**: IBM Plex Mono (tabular-nums)
- **Labels**: IBM Plex Mono (uppercase, tracking-wide)

### Colors (Dark Mode)
| Token | Value |
|---|---|
| Ground | #000000 |
| Panel | #111111 |
| Panel Raised | #1A1A1A |
| Accent | #CCFF00 (chartreuse) |
| Gain | #00C805 |
| Loss | #FF5000 |

### Colors (Light Mode)
| Token | Value |
|---|---|
| Ground | #F7F7F8 |
| Panel | #FFFFFF |
| Panel Raised | #F0F0F0 |
| Accent | #7CB305 |
| Gain | #00873C |
| Loss | #D32F2F |

### Shapes
- Buttons/tabs: pill (border-radius: 999px)
- Cards: 10px radius
- Small elements: 6px radius

### Stock Icons
- Real SVG logos from TradingView's CDN stored locally in `/public/logos/`
- Logo mapping: AAPL=apple, NVDA=nvidia, MSFT=microsoft, GOOGL=alphabet, AMZN=amazon, META=meta-platforms, NFLX=netflix, AMD=advanced-micro-devices, INTC=intel, ORCL=oracle, IBM=international-bus-mach, TSLA=tesla
- Fallback to colored circle with first letter for symbols without logos
- TradingView logo CDN pattern: `https://s3-symbol-logo.tradingview.com/{company-slug}.svg`

---

## TradingView Reference Notes

### Screener View Types (from TradingView Screener)
TradingView's screener has a **VIEW TYPE** dropdown with 3 modes:
1. **Table** (grid icon) - Default view, data table with sortable columns
2. **Charts** (line icon) - Shows interactive chart for selected stock
3. **Heatmap** (squares icon) - Shows treemap heatmap visualization

Our screener implements all 3 view types with the same switcher pattern.

### Screener Table Tabs (from TradingView)
TradingView's table has sub-tabs that change which columns are visible:
- Overview (default), Performance, Technicals, Extended hours, Forecasts, Valuation, Dividends, Profitability, Income statement, Balance sheet, Cash flow, Per share

### Screener Filter Buttons (from TradingView)
TradingView has filter pill buttons across the top:
- AI, Country (US), Watchlist, Index, Price, Chg%, Mkt cap, P/E, EPS dil growth, Div yield%, Sector, Analyst rating, Perf%, Revenue growth, PEG, ROE, Beta, Recent earnings date, Upcoming earnings date, + Add new filter

### Heatmap Controls (from TradingView)
TradingView heatmap has these controls:
- **Source**: S&P 500 Index, etc.
- **Size by**: Market cap
- **Color by**: Change 1D %
- **Group by**: Sector
- Each tile shows the company logo, symbol, and change %
- Tiles are grouped by sector with sector labels
- Color gradient from deep red (-6.75%) to deep green (+6.75%)
