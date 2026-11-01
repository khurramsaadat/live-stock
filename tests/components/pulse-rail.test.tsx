import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PulseRail } from "@/components/market/pulse-rail";
import { makeQuote } from "../fixtures";

const quotes = [
  makeQuote({ symbol: "AAA", price: 102, previousClose: 100 }),
  makeQuote({ symbol: "BBB", price: 305, previousClose: 300 }),
  makeQuote({ symbol: "CCC", price: 98, previousClose: 100 }),
  makeQuote({ symbol: "DDD", price: 105, previousClose: 110 }),
  makeQuote({ symbol: "EEE", price: 50, previousClose: 50 }),
];

function rail() {
  return (
    <PulseRail
      quotes={quotes}
      feedKind="mock"
      status="live"
      detail="mock stream"
      lastUpdated={1_700_000_000_000}
    />
  );
}

describe("PulseRail", () => {
  it("summarises breadth across the list", () => {
    render(rail());

    expect(screen.getByText(/2 up/)).toBeInTheDocument();
    expect(screen.getByText(/2 down/)).toBeInTheDocument();
    expect(screen.getByText(/1 flat/)).toBeInTheDocument();
    expect(screen.getByTestId("breadth-bar").children).toHaveLength(3);
  });

  it("ranks leaders and laggards by percent change", () => {
    render(rail());

    const leaders = within(screen.getByTestId("leaders-list")).getAllByRole("listitem");
    expect(leaders.map((item) => item.textContent)).toEqual(["AAA+2.00%", "BBB+1.67%"]);

    const laggards = within(screen.getByTestId("laggards-list")).getAllByRole("listitem");
    expect(laggards.map((item) => item.textContent)).toEqual(["DDD-4.55%", "CCC-2.00%"]);
  });

  it("reports the adapter and stream state", () => {
    render(rail());

    expect(screen.getByText("mock")).toBeInTheDocument();
    expect(screen.getByText("Streaming")).toBeInTheDocument();
    expect(screen.getByText("Adapter")).toBeInTheDocument();
    expect(screen.getByText("Last print")).toBeInTheDocument();
  });

  it("handles a list with no gainers", () => {
    render(
      <PulseRail
        quotes={[makeQuote({ symbol: "CCC", price: 98, previousClose: 100 })]}
        feedKind="mock"
        status="live"
        lastUpdated={null}
      />,
    );

    expect(screen.getByText("No names in the green.")).toBeInTheDocument();
    expect(screen.queryByTestId("leaders-list")).not.toBeInTheDocument();
  });
});
