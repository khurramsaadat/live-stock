"use client";

import { useState } from "react";

const LOGO_MAP: Record<string, string> = {
  AAPL: "/logos/apple.svg",
  NVDA: "/logos/nvidia.svg",
  MSFT: "/logos/microsoft.svg",
  GOOGL: "/logos/alphabet.svg",
  AMZN: "/logos/amazon.svg",
  META: "/logos/meta-platforms.svg",
  NFLX: "/logos/netflix.svg",
  AMD: "/logos/advanced-micro-devices.svg",
  INTC: "/logos/intel.svg",
  ORCL: "/logos/oracle.svg",
  IBM: "/logos/international-bus-mach.svg",
  TSLA: "/logos/tesla.svg",
};

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
  const logoSrc = LOGO_MAP[symbol];
  const [imgError, setImgError] = useState(false);

  if (logoSrc && !imgError) {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-full bg-white/10 ${className}`}
        style={{ width: size, height: size }}
        aria-hidden
      >
        <img
          src={logoSrc}
          alt=""
          width={Math.round(size * 0.7)}
          height={Math.round(size * 0.7)}
          className="object-contain"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      </span>
    );
  }

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

export function getLogoSrc(symbol: string): string | null {
  return LOGO_MAP[symbol] ?? null;
}
