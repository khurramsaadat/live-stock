import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/market/use-market-feed", async () => {
  const { makeIndexQuotes, makeEquityQuotes } = await import("../fixtures");
  const quotes = [...makeIndexQuotes(), ...makeEquityQuotes().slice(0, 11)];

  return {
    useMarketFeed: () => ({
      quotes,
      status: "live",
      detail: "mock stream",
      feedKind: "mock",
      lastUpdated: 1_700_000_000_000,
    }),
  };
});

const { Dashboard } = await import("@/components/market/dashboard");

beforeEach(() => {
  window.localStorage.clear();
});

describe("Dashboard", () => {
  it("renders the masthead and both sections", () => {
    render(<Dashboard />);

    expect(screen.getByRole("heading", { name: "Indices" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Watchlist" })).toBeInTheDocument();
    expect(screen.getByText("Live Stocks")).toBeInTheDocument();
  });

  it("shows all four indices", () => {
    const { container } = render(<Dashboard />);
    expect(container.querySelectorAll('[data-testid^="index-card-"]')).toHaveLength(4);
  });

  it("lists the default watchlist and its count", () => {
    const { container } = render(<Dashboard />);

    expect(container.querySelectorAll('[data-testid^="row-"]')).toHaveLength(11);
    expect(screen.getByText("11 tracked")).toBeInTheDocument();
  });

  it("exposes the symbol search and the session badge", () => {
    render(<Dashboard />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByTestId("session-badge")).toBeInTheDocument();
  });

  it("carries the data disclaimer", () => {
    render(<Dashboard />);
    expect(screen.getByText(/not investment advice/i)).toBeInTheDocument();
  });
});
