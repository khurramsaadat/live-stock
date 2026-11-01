/** Direction colour used by every price surface. Amber is reserved for state. */
export function changeTone(value: number): string {
  if (value > 0) return "text-emerald";
  if (value < 0) return "text-rust";
  return "text-ink-muted";
}

export function directionLabel(value: number): "up" | "down" | "flat" {
  if (value > 0) return "up";
  if (value < 0) return "down";
  return "flat";
}
