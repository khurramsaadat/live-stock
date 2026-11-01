import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IndexCard } from "@/components/market/index-card";
import { makeQuote } from "../fixtures";

const rising = makeQuote({
  symbol: "^GSPC",
  name: "S&P 500",
  kind: "index",
  previousClose: 6842.31,
  price: 6900,
  history: [6842.31, 6870.5, 6900],
});

describe("IndexCard", () => {
  it("renders the level, change and percent", () => {
    render(<IndexCard quote={rising} />);

    expect(screen.getByTestId("level-^GSPC")).toHaveTextContent("6,900.00");
    expect(screen.getByText("+57.69")).toBeInTheDocument();
    expect(screen.getByText("+0.84%")).toBeInTheDocument();
    expect(screen.getByText("S&P 500")).toBeInTheDocument();
  });

  it("marks the direction on the container", () => {
    const { container } = render(<IndexCard quote={rising} />);
    expect(
      container.querySelector('[data-testid="index-card-^GSPC"]')?.getAttribute("data-direction"),
    ).toBe("up");
  });

  it("draws a sparkline once there is history", () => {
    const { container } = render(<IndexCard quote={rising} />);
    expect(container.querySelector("svg path")).toBeInTheDocument();
  });

  it("prints the day range and positions the marker", () => {
    const { container } = render(<IndexCard quote={rising} />);

    expect(screen.getByText("day range")).toBeInTheDocument();
    expect(screen.getByText("6,842.31")).toBeInTheDocument();
    expect(container.querySelector('span[style*="left"]')).toBeInTheDocument();
  });

  it("reads as a decline when the price is under the previous close", () => {
    const falling = makeQuote({
      symbol: "^IXIC",
      name: "Nasdaq Composite",
      kind: "index",
      previousClose: 100,
      price: 90,
      history: [100, 95, 90],
    });

    const { container } = render(<IndexCard quote={falling} />);

    expect(
      container.querySelector('[data-testid="index-card-^IXIC"]')?.getAttribute("data-direction"),
    ).toBe("down");
    expect(screen.getByText("-10.00")).toBeInTheDocument();
    expect(screen.getByText("-10.00%")).toBeInTheDocument();
  });
});
