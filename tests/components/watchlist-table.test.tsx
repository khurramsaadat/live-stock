import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WatchlistTable } from "@/components/market/watchlist-table";
import { makeQuote } from "../fixtures";

const quotes = [
  makeQuote({ symbol: "AAA", name: "Alpha", price: 100, previousClose: 100 }),
  makeQuote({ symbol: "BBB", name: "Beta", price: 300, previousClose: 250 }),
  makeQuote({ symbol: "CCC", name: "Gamma", price: 50, previousClose: 60 }),
];

function rowOrder(container: HTMLElement): string[] {
  return [...container.querySelectorAll('[data-testid^="row-"]')].map((row) =>
    (row.getAttribute("data-testid") ?? "").replace("row-", ""),
  );
}

describe("WatchlistTable", () => {
  it("keeps the supplied order until a column is sorted", () => {
    const { container } = render(<WatchlistTable quotes={quotes} onRemove={() => {}} />);
    expect(rowOrder(container)).toEqual(["AAA", "BBB", "CCC"]);
  });

  it("sorts by last price, descending then ascending", async () => {
    const user = userEvent.setup();
    const { container } = render(<WatchlistTable quotes={quotes} onRemove={() => {}} />);
    const header = screen.getByRole("button", { name: /sort by last/i });

    await user.click(header);
    expect(rowOrder(container)).toEqual(["BBB", "AAA", "CCC"]);
    expect(screen.getByRole("columnheader", { name: /last/i })).toHaveAttribute(
      "aria-sort",
      "descending",
    );

    await user.click(header);
    expect(rowOrder(container)).toEqual(["CCC", "AAA", "BBB"]);
    expect(screen.getByRole("columnheader", { name: /last/i })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
  });

  it("sorts symbols alphabetically, ascending first", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <WatchlistTable quotes={[quotes[2], quotes[0], quotes[1]]} onRemove={() => {}} />,
    );

    await user.click(screen.getByRole("button", { name: /sort by symbol/i }));

    expect(rowOrder(container)).toEqual(["AAA", "BBB", "CCC"]);
  });

  it("calls onRemove with the symbol", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<WatchlistTable quotes={quotes} onRemove={onRemove} />);

    await user.click(screen.getByRole("button", { name: /remove bbb/i }));

    expect(onRemove).toHaveBeenCalledWith("BBB");
  });

  it("shows change and percent in the row", () => {
    render(<WatchlistTable quotes={quotes} onRemove={() => {}} />);
    const row = screen.getByTestId("row-BBB");

    expect(within(row).getByText("+50.00")).toBeInTheDocument();
    expect(within(row).getByText("+20.00%")).toBeInTheDocument();
    expect(within(row).getByText("Beta")).toBeInTheDocument();
  });

  it("renders an empty state instead of a table", () => {
    render(<WatchlistTable quotes={[]} onRemove={() => {}} />);

    expect(screen.getByText("Nothing tracked yet.")).toBeInTheDocument();
    expect(screen.queryByTestId("watchlist-table")).not.toBeInTheDocument();
  });
});
