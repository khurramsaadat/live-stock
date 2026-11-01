"use client";

import { useNow } from "@/lib/market/use-now";

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "2-digit",
  month: "short",
});

export function SessionClock({ variant = "time" }: { variant?: "time" | "date" }) {
  const now = useNow();

  const text =
    now === 0
      ? variant === "time"
        ? "00:00:00"
        : "DAY SESSION"
      : variant === "time"
        ? timeFormat.format(new Date(now))
        : dateFormat.format(new Date(now)).replace(/,/g, "").toUpperCase();

  return (
    <time
      className="tabular text-3xs text-ink-muted"
      suppressHydrationWarning
      dateTime={now === 0 ? undefined : new Date(now).toISOString()}
    >
      {text}
    </time>
  );
}
