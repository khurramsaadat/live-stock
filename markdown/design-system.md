# Design system

The interface is a quiet broadsheet ledger for markets. Structure comes from
hairline rules and type scale, not from cards. If a change needs a box, a
gradient, or a colour outside the palette, it is the wrong change.

## Typography

Three families, each with one job.

| Role | Family | Weights | Where |
| --- | --- | --- | --- |
| UI and body | Instrument Sans | 400 to 700 variable | Everything readable |
| Display and section titles | Instrument Serif | 400, roman and italic | Masthead wordmark, `Indices`, `Watchlist`, `Market pulse` |
| Labels and figures | IBM Plex Mono | 400, 500 | Eyebrow labels, tickers, prices, percentages, clock |

All three are self hosted through `next/font`, so the desktop build never
requests a font from the network and the first paint is the final paint.

### Scale in use

| Element | Size | Treatment |
| --- | --- | --- |
| Wordmark | 1.65rem | Serif, tracking -0.015em |
| Section title | 1.25rem | Serif italic |
| Index level | clamp(2.2rem, 4vw, 3rem) | Sans 500, tracking -0.04em, tabular |
| Row price | 0.82rem | Mono, tabular |
| Body copy | 0.8rem to 0.95rem | Sans, line height 1.7 |
| Eyebrow | 0.625rem | Mono, uppercase, tracking 0.16em |

`tabular` is a utility in `app/globals.css` that sets IBM Plex Mono and
`font-variant-numeric: tabular-nums`. Any number that changes on a timer uses
it, otherwise digits shift sideways on every tick.

`eyebrow` sets the small uppercase label style. Do not hand roll those values.

## Palette

All tokens live in `@theme` in `app/globals.css`, so they are available as
Tailwind utilities such as `bg-paper`, `text-emerald`, and `border-rule`.

| Token | Hex | Use |
| --- | --- | --- |
| `paper` | `#f5f3ef` | Page background |
| `paper-raised` | `#fbfaf7` | Hovered rows, dropdown surface |
| `paper-sunken` | `#efece6` | Active option in the symbol search |
| `ink` | `#16150f` | Primary text |
| `ink-soft` | `#4b483f` | Secondary text |
| `ink-muted` | `#6b6658` | Labels, meta, disabled |
| `rule` | `#e0dbd1` | Standard hairline |
| `rule-strong` | `#cbc4b6` | Section rules, table head |
| `amber` | `#9a5a08` | System state, focus, active marker, primary action |
| `amber-quiet` | `#f2e4ca` | Text selection |
| `emerald` | `#0d6647` | Advancing price |
| `emerald-quiet` | `#dcefe2` | Rising tick tint |
| `rust` | `#97381c` | Declining price |
| `rust-quiet` | `#f3ded4` | Falling tick tint |

Contrast against `paper`, measured in the running app: body 16.5:1, `ink-soft`
8.25:1, `ink-muted` 5.17:1. All three pass AA for small text, and
`ink-muted` is the floor. Do not introduce a lighter grey.

### Absolute colour rules

1. No blue, indigo, or violet anywhere. Not in a border, a focus ring, a chart,
   or a hover state. The only exception is the Next.js development badge, which
   does not ship.
2. No gradients. Flat fills only.
3. Amber means state, never direction. Emerald and rust mean direction, never
   decoration.
4. Daylight only. There is no dark variant and no `prefers-color-scheme` branch.

## Layout

- Page padding is `px-8` at small widths and `px-12` from `sm` upward.
- The masthead sits above a double rule: a strong hairline, a 3px gap, then a
  light hairline.
- The index band is a grid with `gap-px` over a `bg-rule` background. The grid
  itself supplies the dividers, so the number of columns can change without
  touching border utilities.
- Below the band: a two column split at `lg`, ledger on the left, a 272px pulse
  rail on the right, separated by a vertical hairline.
- Nothing uses a border radius except the 6px status dots and the 5px range
  marker. Panels and buttons are square.
- No box shadows. Depth comes from background steps, not elevation.

## Motion

Four moments, all CSS, all disabled under `prefers-reduced-motion: reduce`.

| Moment | Class | Timing |
| --- | --- | --- |
| Section entrance | `reveal` with `--reveal-delay` | 620ms, staggered 0/90/170ms |
| Sparkline first draw | `spark-path` | 1100ms, once |
| Price tick tint | `tick-up` / `tick-down` | 780ms fade to transparent |
| Live indicator | `live-dot` | 2600ms breathing loop |
| Day range marker | inline `left` transition | 700ms ease out |

The price tint works by keying the price span on the price value, so the
element remounts on each print and the animation restarts. Do not replace that
with a listener.

## Component inventory

| Component | Responsibility | Notable detail |
| --- | --- | --- |
| `Dashboard` | Composition and hooks | Owns the only `useMarketFeed` call |
| `IndexCard` | One index panel | Level, change, sparkline, day range track |
| `WatchlistTable` | The ledger | Sortable headers, tick tint, hover remove |
| `AddSymbol` | Search and add | Combobox roles, arrow keys, Enter, Escape |
| `PulseRail` | Context column | Breadth bar, leaders, laggards, stream state, legend |
| `Sparkline` | Inline price path | Hand built SVG, no chart library |
| `StatusPill` | Feed connection state | Dot colour maps to feed status |
| `SessionBadge` | US market session | Exchange local time, not device time |
| `SessionClock` | Date and time | Shared one second store |

## Copy rules

- Short declarative sentences. No exclamation marks.
- No em dashes and no en dashes anywhere in the interface or documentation.
- Direction words: advancing, declining, flat. Not bullish, bearish, moon.
- The interface never claims live data when the adapter is the mock. The footer
  says simulated data and not investment advice whenever `feedKind` is mock.

## Adding a component

1. Take a `Quote` or primitives as props. Do not connect a feed.
2. Use tokens, not hex values.
3. Put numbers in `tabular`, labels in `eyebrow`.
4. Use a rule for separation before reaching for a background.
5. Add a `data-testid` only if a test needs to address it.
6. Check the reduced motion path and the 1024px minimum window width.
