"use client";

import { useState } from "react";

const LOGO_MAP: Record<string, string> = {
  // Technology
  AAPL: "/logos/apple.svg",
  NVDA: "/logos/nvidia.svg",
  MSFT: "/logos/microsoft.svg",
  AVGO: "/logos/broadcom.svg",
  ORCL: "/logos/oracle.svg",
  AMD: "/logos/advanced-micro-devices.svg",
  CRM: "/logos/salesforce.svg",
  CSCO: "/logos/cisco.svg",
  INTC: "/logos/intel.svg",
  IBM: "/logos/international-bus-mach.svg",
  QCOM: "/logos/qualcomm.svg",
  PLTR: "/logos/palantir.svg",
  CRWD: "/logos/crowdstrike.svg",
  ADBE: "/logos/adobe.svg",
  NOW: "/logos/servicenow.svg",
  SNPS: "/logos/synopsys.svg",
  PANW: "/logos/palo-alto-networks.svg",
  SHOP: "/logos/shopify.svg",
  SQ: "/logos/block.svg",
  SNOW: "/logos/snowflake.svg",
  MU: "/logos/micron-technology.svg",
  AMAT: "/logos/applied-materials.svg",
  LRCX: "/logos/lam-research.svg",

  // Communication
  GOOGL: "/logos/alphabet.svg",
  META: "/logos/meta-platforms.svg",
  NFLX: "/logos/netflix.svg",
  DIS: "/logos/disney.svg",
  CMCSA: "/logos/comcast.svg",
  T: "/logos/at-t.svg",
  VZ: "/logos/verizon.svg",
  SPOT: "/logos/spotify.svg",

  // Consumer Cyclical
  AMZN: "/logos/amazon.svg",
  TSLA: "/logos/tesla.svg",
  HD: "/logos/home-depot.svg",
  COST: "/logos/costco-wholesale.svg",
  UBER: "/logos/uber.svg",
  NKE: "/logos/nike.svg",
  SBUX: "/logos/starbucks.svg",
  BKNG: "/logos/booking-holdings.svg",
  MCD: "/logos/mcdonalds.svg",
  TJX: "/logos/tjx-companies.svg",

  // Consumer Defensive
  WMT: "/logos/walmart.svg",
  KO: "/logos/coca-cola.svg",
  PEP: "/logos/pepsico.svg",
  PG: "/logos/procter-and-gamble.svg",
  PM: "/logos/philip-morris.svg",
  CL: "/logos/colgate-palmolive.svg",
  MDLZ: "/logos/mondelez.svg",

  // Financials
  JPM: "/logos/jpmorgan-chase.svg",
  V: "/logos/visa.svg",
  MA: "/logos/mastercard.svg",
  BAC: "/logos/bank-of-america.svg",
  GS: "/logos/goldman-sachs.svg",
  MS: "/logos/morgan-stanley.svg",
  WFC: "/logos/wells-fargo.svg",
  "BRK.B": "/logos/berkshire-hathaway.svg",
  AXP: "/logos/american-express.svg",
  SCHW: "/logos/charles-schwab.svg",
  C: "/logos/citigroup.svg",
  BLK: "/logos/blackrock.svg",
  PYPL: "/logos/paypal.svg",

  // Healthcare
  LLY: "/logos/eli-lilly.svg",
  JNJ: "/logos/johnson-and-johnson.svg",
  PFE: "/logos/pfizer.svg",
  ABBV: "/logos/abbvie.svg",
  UNH: "/logos/unitedhealth.svg",
  MRK: "/logos/merck.svg",
  TMO: "/logos/thermo-fisher.svg",
  ABT: "/logos/abbott-laboratories.svg",
  BMY: "/logos/bristol-myers-squibb.svg",
  ISRG: "/logos/intuitive-surgical.svg",
  GILD: "/logos/gilead-sciences.svg",
  AMGN: "/logos/amgen.svg",

  // Energy
  XOM: "/logos/exxon.svg",
  CVX: "/logos/chevron.svg",
  COP: "/logos/conocophillips.svg",
  SLB: "/logos/schlumberger.svg",
  EOG: "/logos/eog-resources.svg",

  // Industrials
  CAT: "/logos/caterpillar.svg",
  BA: "/logos/boeing.svg",
  HON: "/logos/honeywell.svg",
  GE: "/logos/ge-aerospace.svg",
  LMT: "/logos/lockheed-martin.svg",
  DE: "/logos/john-deere.svg",
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
