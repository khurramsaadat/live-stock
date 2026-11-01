"use client";

import { useId, useMemo, useRef, useState } from "react";
import type { MarketSymbol } from "@/lib/market/types";

interface AddSymbolProps {
  available: MarketSymbol[];
  onAdd: (symbol: string) => boolean;
}

export function AddSymbol({ available, onAdd }: AddSymbolProps) {
  const inputId = useId();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const disabled = available.length === 0;

  const matches = useMemo(() => {
    const needle = query.trim().toUpperCase();
    const pool = needle
      ? available.filter(
          (entry) =>
            entry.symbol.includes(needle) || entry.name.toUpperCase().includes(needle),
        )
      : available;
    return pool.slice(0, 6);
  }, [available, query]);

  const commit = (symbol?: string) => {
    const target = symbol ?? matches[active]?.symbol ?? matches[0]?.symbol;
    if (!target) return;
    if (onAdd(target)) {
      setQuery("");
      setActive(0);
      setOpen(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActive((c) => (matches.length === 0 ? 0 : (c + 1) % matches.length));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActive((c) => (matches.length === 0 ? 0 : (c - 1 + matches.length) % matches.length));
    }
    if (event.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  };

  return (
    <form
      className="relative flex items-center gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        commit();
      }}
    >
      <div className="flex items-center gap-2 rounded-full border border-border bg-panel-raised px-3 transition-colors duration-200 focus-within:border-accent">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-ink-muted shrink-0">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <label htmlFor={inputId} className="sr-only">
          Search symbols to track
        </label>
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={open && matches.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            open && matches[active] ? `${listId}-${matches[active].symbol}` : undefined
          }
          autoComplete="off"
          spellCheck={false}
          placeholder="Search symbol"
          value={query}
          disabled={disabled}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={handleKeyDown}
          className="w-[8rem] bg-transparent py-1.5 font-mono text-3xs uppercase tracking-[0.14em] text-ink placeholder:text-ink-muted focus:outline-none disabled:opacity-40"
        />
      </div>

      <button
        type="submit"
        disabled={disabled || matches.length === 0}
        className="rounded-full bg-accent px-3.5 py-1.5 font-mono text-3xs font-medium uppercase tracking-[0.14em] text-ground transition-opacity duration-150 hover:opacity-90 disabled:opacity-30"
      >
        Track
      </button>

      {open && matches.length > 0 ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="Symbol matches"
          className="absolute right-0 top-full z-20 mt-2 w-[17rem] overflow-y-auto rounded-card border border-border bg-panel py-1 shadow-xl"
        >
          {matches.map((entry, index) => (
            <li key={entry.symbol} role="none">
              <button
                type="button"
                role="option"
                id={`${listId}-${entry.symbol}`}
                aria-selected={index === active}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActive(index)}
                onClick={() => commit(entry.symbol)}
                className={`flex w-full items-baseline justify-between gap-3 px-3 py-2 text-left transition-colors duration-100 ${
                  index === active ? "bg-panel-raised" : ""
                }`}
              >
                <span className="tabular text-2xs font-medium tracking-wide">{entry.symbol}</span>
                <span className="truncate text-3xs text-ink-muted">{entry.name}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {open && matches.length === 0 && query ? (
        <p
          role="status"
          className="absolute right-0 top-full z-20 mt-2 w-[17rem] rounded-card border border-border bg-panel px-3 py-2 text-3xs text-ink-muted"
        >
          No symbol matches that search.
        </p>
      ) : null}
    </form>
  );
}
