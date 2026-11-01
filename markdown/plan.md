# Live Stocks - Redesign Plan

## Vision

A premium dark terminal-style stock dashboard inspired by Robinhood's visual identity (pure black ground, chartreuse accent, serif headlines, pill buttons) combined with TradingView's data power. Tabbed layout with real-time data from Finnhub (equities) + TwelveData (indices).

---

## Build Stages

### Stage 1 - Design System + Layout Shell - DONE
- [x] New CSS theme (Robinhood palette: #000 ground, #CCFF00 accent, #00C805 gain, #FF5000 loss)
- [x] Dark/light theme toggle with localStorage persistence
- [x] Tab navigation component (Dashboard, Watchlist, Heatmap, Charts) with chartreuse pill active state
- [x] New header with logo + tabs + session clock + status pill + theme toggle
- [x] Scrolling ticker tape component (all symbols, auto-scroll, pause on hover)
- [x] Compact footer

### Stage 2 - Data Layer Fix - DONE
- [x] Apply provider previousClose to fix change percentages (was showing +135% instead of -4%)
- [x] Safe fallback for HMR state shape changes
- [x] Filter heatmap/charts to only show equities with live data

### Stage 3 - Dashboard Tab - DONE
- [x] Index cards row (4 cards in a grid with sparklines)
- [x] Top movers section (Leaders + Laggards, sorted by changePercent)
- [x] Market pulse sidebar (breadth bar, stream status, legend)

### Stage 4 - Watchlist Tab - DONE
- [x] Redesigned table with dark panel rows, hover borders, chartreuse accent
- [x] Sort headers with amber arrows
- [x] Sparkline intraday column
- [x] Tick-up/tick-down flash animation
- [x] Search combobox with pill-shaped input + chartreuse Track button
- [x] Reset to default pill button
- [ ] Drag-to-reorder with drag handles (future)
- [ ] Multiple named watchlists with tab bar (future)

### Stage 5 - Heatmap Tab - DONE
- [x] Squarified treemap layout (SVG) sized by previousClose
- [x] Green/red fill by changePercent intensity
- [x] Hover tooltip showing symbol, name, price, change
- [x] Symbol labels and percent on tiles large enough to display

### Stage 6 - Charts Tab - DONE
- [x] Full-width SVG chart with gradient area fill
- [x] Grid lines with price axis labels
- [x] Crosshair cursor with price readout on hover
- [x] Symbol selector pills (chartreuse active, bordered inactive)
- [x] Stats row (Open, High, Low, Prev Close)
- [x] "Waiting for price history" state when < 2 data points

### Stage 7 - Polish (future)
- [ ] Drag-to-reorder watchlist
- [ ] Multiple named watchlists
- [ ] Keyboard shortcuts (/, Ctrl+K, D, Escape)
- [ ] Mobile responsive fine-tuning
- [ ] Price alerts (browser notifications)
- [ ] Compare mode overlay

---

## Design System

### Dark Mode (default)
| Token | Value |
|---|---|
| Ground | #000000 |
| Panel | #141414 |
| Accent | #CCFF00 (chartreuse) |
| Gain | #00C805 (Robinhood green) |
| Loss | #FF5000 (Robinhood red-orange) |

### Light Mode
| Token | Value |
|---|---|
| Ground | #F5F5F5 |
| Panel | #FFFFFF |
| Accent | #7CB305 |
| Gain | #00873C |
| Loss | #D32F2F |

### Typography
- Headlines: Instrument Serif italic
- UI/Body: Instrument Sans
- Numbers: IBM Plex Mono tabular
- Eyebrow/Labels: Plex Mono 10px uppercase

### Shapes
- Buttons/tabs: pill (border-radius: 999px)
- Cards: 8px radius
