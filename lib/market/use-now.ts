"use client";

import { useSyncExternalStore } from "react";

/**
 * One timer for every clock in the interface, instead of one per component.
 * The server snapshot is 0 so the prerendered export shows a placeholder and
 * the client switches to real time right after hydration.
 */
let current = 0;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

function tick() {
  current = Date.now();
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) {
    // Refresh the snapshot for the first subscriber without notifying, React
    // re-reads it right after subscribing.
    current = Date.now();
    timer = setInterval(tick, 1000);
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

const getSnapshot = () => current;
const getServerSnapshot = () => 0;

export function useNow(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
