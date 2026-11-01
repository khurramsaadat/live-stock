import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AddSymbol } from "@/components/market/add-symbol";
import type { MarketSymbol } from "@/lib/market/types";

const available: MarketSymbol[] = [
  { symbol: "TSLA", name: "Tesla", kind: "equity", previousClose: 400 },
  { symbol: "XOM", name: "Exxon Mobil", kind: "equity", previousClose: 110 },
];

describe("AddSymbol", () => {
  it("filters by ticker", async () => {
    const user = userEvent.setup();
    render(<AddSymbol available={available} onAdd={() => true} />);

    await user.click(screen.getByRole("combobox"));
    await user.type(screen.getByRole("combobox"), "tes");

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent("TSLA");
  });

  it("filters by company name", async () => {
    const user = userEvent.setup();
    render(<AddSymbol available={available} onAdd={() => true} />);

    await user.type(screen.getByRole("combobox"), "exxon");

    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(screen.getByRole("option")).toHaveTextContent("XOM");
  });

  it("adds the top match from the Track button", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn(() => true);
    render(<AddSymbol available={available} onAdd={onAdd} />);

    await user.type(screen.getByRole("combobox"), "tes");
    await user.click(screen.getByRole("button", { name: /track/i }));

    expect(onAdd).toHaveBeenCalledWith("TSLA");
  });

  it("adds a specific match when an option is clicked", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn(() => true);
    render(<AddSymbol available={available} onAdd={onAdd} />);

    await user.type(screen.getByRole("combobox"), "exx");
    await user.click(screen.getByRole("option"));

    expect(onAdd).toHaveBeenCalledWith("XOM");
  });

  it("reports when nothing matches the query", async () => {
    const user = userEvent.setup();
    render(<AddSymbol available={available} onAdd={() => true} />);

    await user.type(screen.getByRole("combobox"), "zzz");

    expect(screen.getByRole("status")).toHaveTextContent("No symbol matches that search.");
    expect(screen.queryAllByRole("option")).toHaveLength(0);
  });

  it("closes the list on Escape", async () => {
    const user = userEvent.setup();
    render(<AddSymbol available={available} onAdd={() => true} />);

    await user.type(screen.getByRole("combobox"), "t");
    expect(screen.getAllByRole("option").length).toBeGreaterThan(0);

    await user.keyboard("{Escape}");

    expect(screen.queryAllByRole("option")).toHaveLength(0);
  });

  it("disables itself when every symbol is already tracked", () => {
    render(<AddSymbol available={[]} onAdd={() => true} />);

    expect(screen.getByRole("combobox")).toBeDisabled();
    expect(screen.getByText("All tracked")).toBeInTheDocument();
  });
});
