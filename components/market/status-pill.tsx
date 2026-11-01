import type { FeedStatus } from "@/lib/market/types";

const labels: Record<FeedStatus, string> = {
  idle: "Idle",
  connecting: "Connecting",
  live: "Live",
  stalled: "Reconnecting",
  error: "Offline",
};

const dotTone: Record<FeedStatus, string> = {
  idle: "bg-ink-muted",
  connecting: "bg-accent",
  live: "bg-gain live-dot",
  stalled: "bg-accent",
  error: "bg-loss",
};

export function StatusPill({ status, detail }: { status: FeedStatus; detail?: string }) {
  return (
    <span className="inline-flex items-center gap-2" data-status={status}>
      <span
        aria-hidden
        className={`size-[6px] rounded-full ${dotTone[status]}`}
      />
      <span className="font-mono text-3xs uppercase tracking-[0.14em] text-ink-muted">
        {labels[status]}
      </span>
      <span className="sr-only">
        Connection status: {labels[status]}
        {detail ? `, ${detail}` : ""}
      </span>
    </span>
  );
}
