"use client";

import { getSessionInfo, type SessionState } from "@/lib/market/session";
import { useNow } from "@/lib/market/use-now";

const dotTone: Record<SessionState, string> = {
  open: "bg-gain live-dot",
  pre: "bg-accent",
  after: "bg-accent",
  closed: "bg-ink-muted",
};

export function SessionBadge() {
  const now = useNow();
  const info = now === 0 ? null : getSessionInfo(new Date(now));
  const state = info?.state ?? "closed";

  return (
    <span
      className="inline-flex items-center gap-2"
      data-testid="session-badge"
      data-state={state}
    >
      <span aria-hidden className={`size-[6px] rounded-full ${dotTone[state]}`} />
      <span className="font-mono text-3xs uppercase tracking-[0.14em] text-ink-muted">
        {info?.label ?? "Session"}
      </span>
      <span className="sr-only">US market session</span>
    </span>
  );
}
