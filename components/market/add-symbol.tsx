"use client";

import { useId, useMemo, useRef, useState } from "react";
import type { MarketSymbol } from "@/lib/market/types";

interface AddSymbolProps {
  available: MarketSymbol[];
  onAdd: (symbol: string) => boolean;
}

/**
 * Search first, like the sites reviewed: type a ticker or a company name,
 * arrow through the matches, Enter to track. The input keeps focus while the
 * list is open, so the palette never loses the keyboard.
 */
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
      setActive((current) => (matches.length === 0 ? 0 : (current + 1) % matches.length));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActive((current) =>
        matches.length === 0 ? 0 : (current - 1 + matches.length) % matches.length,
      );
    }
    if (event.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  };

  return (
    <form
      className="relative flex items-center gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        commit();
      }}
    >
      <div className="flex items-center gap-2 border-b border-rule-strong transition-colors duration-200 focus-within:border-amber hover:border-ink">
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
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={handleKeyDown}
          className="w-[9.5rem] bg-transparent py-1 font-mono text-3xs uppercase tracking-[0.16em] text-ink placeholder:text-ink-muted focus:outline-none disabled:opacity-40"
        />
      </div>

      {disabled ? (
        <span className="font-mono text-3xs uppercase tracking-[0.16em] text-ink-muted">
          All tracked
        </span>
      ) : null}

      <button
        type="submit"
        disabled={disabled || matches.length === 0}
        className="border-b border-amber pb-1 font-mono text-3xs uppercase tracking-[0.16em] text-amber transition-colors duration-200 hover:border-ink hover:text-ink disabled:border-rule disabled:text-ink-muted"
      >
        Track
      </button>

      {open && matches.length > 0 ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="Symbol matches"
          className="absolute right-0 top-full z-20 mt-2 w-[17rem] overflow-y-auto border border-rule bg-paper-raised py-1"
        >
          {matches.map((entry, index) => (
            <li key={entry.symbol} role="none">
              <button
                type="button"
                role="option"
                id={`${listId}-${entry.symbol}`}
                aria-selected={index === active}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActive(index)}
                onClick={() => commit(entry.symbol)}
                className={`flex w-full items-baseline justify-between gap-3 px-3 py-2 text-left transition-colors duration-150 ${
                  index === active ? "bg-paper-sunken" : ""
                }`}
              >
                <span className="tabular text-2xs tracking-[0.04em]">{entry.symbol}</span>
                <span className="truncate text-3xs text-ink-muted">{entry.name}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {open && matches.length === 0 ? (
        <p
          role="status"
          className="absolute right-0 top-full z-20 mt-2 w-[17rem] border border-rule bg-paper-raised px-3 py-2 text-3xs text-ink-muted"
        >
          {query ? "No symbol matches that search." : "Every symbol is already tracked."}
        </p>
      ) : null}
    </form>
  );
}
