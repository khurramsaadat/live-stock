# Competitive review: five market sites against Live Stocks

Reviewed November 2026. Scope is the market data surface only: what each site
puts in front of a visitor, how a watchlist behaves, which quote fields are
default, and how session state and data provenance are communicated.

## Sites reviewed

| Site | What it is | Notes on the review |
| --- | --- | --- |
| Yahoo Finance | Consumer finance portal, editorial first | Watchlist and portfolio are sign-in gated, so their controls could not be verified |
| MarketWatch | News led market site with a data center | Quote pages behind CAPTCHA, homepage and movers verified |
| Google Finance | Clean data grid with a left rail of lists | Watchlist style grid rendered to anonymous visitors |
| Bloomberg Markets | Institutional reference data plus editorial | Data pages are fixed schema tables, watchlist is subscriber only |
| TradingView | Trading utility, dense and configurable | Most complete watchlist control surface |

Caveat: quote level pages on MarketWatch and the authenticated watchlist on
Yahoo and Bloomberg could not be inspected. Claims about those are marked as
unverified rather than assumed.

## What each site actually does

### Yahoo Finance

The home page leads with editorial, not data. It has no persistent index strip;
index chips sit inside headline cards. The real dashboard is `/markets/`, an
overview table segmented by region (America, Europe, Asia) with symbol, price and
percent change, plus an inline sparkline per row. Quote pages carry the richest
field set of the five: previous close, open, bid and ask with size, day range,
52 week range, volume, average volume, market cap, beta, PE, EPS, earnings date,
dividend and yield. Session state is the clearest anywhere: regular close,
after hours print and a venue tag such as "Nasdaq Real Time Price" or "Delayed
Quote" are shown as separate labelled lines.

### MarketWatch

A titled "Markets" block with region tabs, then an index strip that carries Dow,
S&P 500, Nasdaq, VIX, gold and crude oil together with a trend glyph per row.
Below it sits an embedded chart with range toggles from 1D to 2Y. Movers are
split into Leaders and Laggards, four rows each. Session segmentation exists as
separate pages for premarket and after hours movers. Data provenance is a single
FactSet attribution in the footer, with an explicit note that all quotes are in
local exchange time.

### Google Finance

The only one of the five that renders a watchlist shaped grid to an anonymous
visitor. The grid header doubles as the sort specification: trend, change,
price, percent change, previous close, open, high, low, volume and market cap,
each sortable. Lists live in a left rail with a list selector and a new list
action. Session labelling is per security type: the after hours tier gets an
icon and a "Closed" timestamp, while indices simply show a timestamp. News
modules carry their source attribution inline.

### Bloomberg Markets

Two personalities. The hub is a magazine page with a nine item ticker strip and
large photography. The data pages are dense fixed schema tables grouped by
region, with trailing one month and one year returns and a `Time (EDT)` column
that serves as the only session signal. Movers arrive as an audio segment, not
a table. The watchlist is subscriber only, capped at 100 lists of 100 tickers,
seedable from themed templates, with list linked news and a bell for alerts.
Delays are disclosed in footnotes, for example currency data at 25 minutes.

### TradingView

The densest and most configurable. A long chip and tile dashboard covers
indices, stocks, community trends, volatility, movers, earnings, crypto, futures,
FX and bonds. The watchlist is a dockable panel available on every page, with
symbol search via a plus button, multiple lists, named sections, drag to
reorder, click header sorting, column show and hide, table versus row view,
right click remove, import and export, and list level alerts. Default columns
are limited to last, change, percent change, volume and extended hours change.

## Feature matrix

Legend: yes means confirmed in the review, partial means present but limited or
gated, blank means unverified or absent.

| Capability | Yahoo | MarketWatch | Google | Bloomberg | TradingView | Live Stocks |
| --- | --- | --- | --- | --- | --- | --- |
| Persistent index strip | | yes | yes | yes | partial | yes |
| Indices beyond S&P and Nasdaq | yes | yes | yes | yes | yes | yes |
| Watchlist visible without sign in | | | yes | | yes | yes |
| Search to add a symbol | partial | yes | yes | yes | yes | yes |
| Remove a symbol | partial | | | yes | yes | yes |
| Sort by column | partial | | yes | | yes | yes |
| Drag to reorder rows | | | | | yes | |
| Multiple lists or sections | | | yes | yes | yes | |
| Column customization | | | | | yes | |
| Inline sparkline per row | yes | | partial | partial | partial | yes |
| Day range per quote | yes | | yes | yes | yes | yes |
| Volume and market cap | yes | | yes | yes | yes | |
| Leaders and laggards | yes | yes | | partial | yes | yes |
| Breadth summary | | | | | | yes |
| Explicit session state | yes | partial | partial | | partial | yes |
| Data provenance or disclaimer | yes | yes | partial | yes | partial | yes |
| Extended hours prices | yes | yes | yes | | yes | |
| News, alerts, calendars | yes | yes | yes | yes | yes | |

## What was adopted now

| Pattern | Source | Where it lives |
| --- | --- | --- |
| Expanded index strip, four indices in one band | MarketWatch, Google, Bloomberg | `components/market/index-card.tsx` and the hero grid in `dashboard.tsx` |
| Search to add a symbol, keyboard driven, with symbol and name matching | Google, TradingView, Bloomerg search | `components/market/add-symbol.tsx` |
| Click a column header to sort, with an `aria-sort` state | Google, TradingView | `components/market/watchlist-table.tsx` |
| Day range with a position marker per index | Yahoo, Google, Bloomberg | `components/market/index-card.tsx` |
| Leaders and laggards lists | MarketWatch, TradingView | `components/market/pulse-rail.tsx` |
| Explicit US session state, pre-market through after hours | Yahoo | `lib/market/session.ts`, `components/market/session-badge.tsx` |
| Data provenance and "not investment advice" line | MarketWatch, Yahoo | footer in `dashboard.tsx` |
| Full requested symbol set: Nvidia, Amazon, Alphabet, Intel, Meta, Netflix, AMD, Microsoft, Oracle, IBM, plus Tesla, JPMorgan and Exxon | user request | `lib/market/universe.ts` |

## What was deliberately not adopted

| Capability | Why not yet |
| --- | --- |
| Drag to reorder watchlist rows | Needs pointer driven reordering and a persisted order model. Worth doing, but it is a milestone of its own and should land with tests |
| Multiple watchlists and named sections | Needs a storage schema migration from the current flat list. Cheap to add later, not worth guessing the shape now |
| Column customization and column resizing | Our ledger is deliberately narrow. Adding a column system would work against the design language |
| Volume, market cap, PE, EPS, 52 week range | Our feed contract is price only. These fields require a provider that supplies fundamentals, which is a data decision, not a UI one |
| Extended hours data and premarket pages | Requires a provider that separates sessions in its payload. The mock feed has one continuous session |
| News, alerts, earnings and IPO calendars | Needs a news provider and a notification surface. Alerts also need a Rust side scheduler to fire when the window is closed |
| Portfolio and sign in | Product scope decision. A local desktop watchlist already covers the personal case without an account |
| Sector heatmaps | Needs sector metadata for every symbol plus a colour encoding. Our palette is directional only, so a heatmap would break the no blue rule and the two tone model |

## Tradeoffs worth remembering

- Yahoo and Google both expose session state, but neither models holidays in an
  obvious way. Our clock also ignores exchange holidays and says so in code.
- Bloomberg is the only one that treats data delay as a first class disclosure.
  Our footer states the data is simulated until a provider is configured.
- TradingView proves configurability is a product of its own. Copying it
  half way would add controls without the model behind them.

## Sources read

- https://finance.yahoo.com/ and https://finance.yahoo.com/markets/ and https://finance.yahoo.com/quote/AAPL/
- https://www.marketwatch.com/ (via text proxy, direct fetch returned 401)
- https://www.google.com/finance/markets/indexes and https://www.google.com/finance/quote/AAPL:NASDAQ
- https://www.bloomberg.com/markets and https://www.bloomberg.com/markets/stocks and https://www.bloomberg.com/markets/watchlist
- https://www.tradingview.com/markets/ and https://www.tradingview.com/support/solutions/43000745825-mastering-the-tradingview-watchlists/
