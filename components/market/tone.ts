/** Direction color using Robinhood-style gain/loss palette. */
export function changeTone(value: number): string {
  if (value > 0) return "text-gain";
  if (value < 0) return "text-loss";
  return "text-ink-muted";
}

export function changeBg(value: number): string {
  if (value > 0) return "bg-gain";
  if (value < 0) return "bg-loss";
  return "bg-ink-muted";
}

export function directionLabel(value: number): "up" | "down" | "flat" {
  if (value > 0) return "up";
  if (value < 0) return "down";
  return "flat";
}
