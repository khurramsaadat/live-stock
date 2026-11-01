const COLORS: Record<string, string> = {
  AAPL: "#A2AAAD",
  NVDA: "#76B900",
  MSFT: "#00A4EF",
  GOOGL: "#4285F4",
  AMZN: "#FF9900",
  META: "#0081FB",
  NFLX: "#E50914",
  AMD: "#ED1C24",
  INTC: "#0071C5",
  ORCL: "#F80000",
  IBM: "#054ADA",
  TSLA: "#CC0000",
  JPM: "#003087",
  XOM: "#FF0000",
};

function hashColor(symbol: string): string {
  let hash = 0;
  for (const char of symbol) hash = char.charCodeAt(0) + ((hash << 5) - hash);
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 55%, 50%)`;
}

export function StockIcon({
  symbol,
  size = 28,
  className = "",
}: {
  symbol: string;
  size?: number;
  className?: string;
}) {
  const bg = COLORS[symbol] ?? hashColor(symbol);
  const letter = symbol.replace("^", "").charAt(0);

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-heading font-bold text-white ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        backgroundColor: bg,
      }}
      aria-hidden
    >
      {letter}
    </span>
  );
}
