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
  connecting: "bg-amber",
  live: "bg-emerald live-dot",
  stalled: "bg-amber",
  error: "bg-rust",
};

export function StatusPill({ status, detail }: { status: FeedStatus; detail?: string }) {
  return (
    <span className="inline-flex items-center gap-2.5" data-status={status}>
      <span
        aria-hidden
        className={`size-[6px] rounded-full ${dotTone[status]}`}
      />
      <span className="font-mono text-3xs uppercase tracking-[0.16em] text-ink-soft">
        {labels[status]}
      </span>
      <span className="sr-only">
        Connection status: {labels[status]}
        {detail ? `, ${detail}` : ""}
      </span>
    </span>
  );
}
