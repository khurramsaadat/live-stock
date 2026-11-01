const priceFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

/** Always carries an explicit sign, the interface relies on it. */
export function formatChange(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${priceFormatter.format(Math.abs(value))}`;
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${Math.abs(value).toFixed(2)}%`;
}

export function formatClock(epochMs: number | null): string {
  if (!epochMs) return "waiting";
  return new Date(epochMs).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}
