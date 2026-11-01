export type SessionState = "pre" | "open" | "after" | "closed";

export interface SessionInfo {
  state: SessionState;
  label: string;
  /** Minutes since midnight in the exchange timezone. */
  minutes: number;
}

const weekdayIndex: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

/**
 * Regular US equity session, in exchange local time. Holidays are not modelled
 * yet, so a holiday reads as an open session. That is a known gap, not an
 * oversight in the clock.
 */
export function getSessionInfo(now: Date, timeZone = "America/New_York"): SessionInfo {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "Mon";
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0") % 24;
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "0");
  const minutes = hour * 60 + minute;

  const day = weekdayIndex[weekday] ?? 1;
  if (day === 0 || day === 6) {
    return { state: "closed", label: "Closed", minutes };
  }

  if (minutes < 4 * 60) return { state: "closed", label: "Closed", minutes };
  if (minutes < 9 * 60 + 30) return { state: "pre", label: "Pre-market", minutes };
  if (minutes < 16 * 60) return { state: "open", label: "Open", minutes };
  if (minutes < 20 * 60) return { state: "after", label: "After hours", minutes };
  return { state: "closed", label: "Closed", minutes };
}
