import { browser, $, $$, expect } from "@wdio/globals";

/**
 * These specs run against the built desktop binary, so they cover the whole
 * chain: the static export, the WebView2 host, and the real DOM the user sees.
 */
describe("Live Stocks desktop window", () => {
  before(async () => {
    await browser.waitUntil(
      async () => (await browser.getTitle()) === "Live Stocks",
      { timeout: 30000, timeoutMsg: "the window title never became Live Stocks" },
    );
  });

  it("opens on the dashboard", async () => {
    await expect($("#indices-heading")).toHaveText("Indices");
    await expect($("#watchlist-heading")).toHaveText("Watchlist");
    await expect($("#pulse-heading")).toHaveText("Market pulse");
  });

  it("renders the search field and the session state", async () => {
    await expect($('input[role="combobox"]')).toBeDisplayed();
    await expect($('[data-testid="session-badge"]')).toBeDisplayed();
  });

  it("shows four index panels", async () => {
    const cards = await $$('[data-testid^="index-card-"]');
    expect(cards.length).toBe(4);
    await expect($('[data-testid="index-card-^GSPC"]')).toBeDisplayed();
    await expect($('[data-testid="index-card-^IXIC"]')).toBeDisplayed();
  });

  it("lists the watchlist with live prices", async () => {
    const rows = await $$('[data-testid^="row-"]');
    expect(rows.length).toBeGreaterThanOrEqual(11);
    await expect($('[data-testid="row-NVDA"]')).toBeDisplayed();

    const price = await $('[data-testid="row-NVDA"] td:nth-child(3)').getText();
    expect(price).toMatch(/\d/);
  });

  it("runs inside a desktop sized viewport", async () => {
    const size = await browser.execute(() => ({
      width: window.innerWidth,
      height: window.innerHeight,
    }));
    expect(size.width).toBeGreaterThanOrEqual(1024);
    expect(size.height).toBeGreaterThanOrEqual(600);
  });

  it("adds a symbol from the search box", async () => {
    const input = $('input[role="combobox"]');
    await input.setValue("TSLA");
    await $('button[type="submit"]').click();

    await browser.waitUntil(
      async () => await $('[data-testid="row-TSLA"]').isExisting(),
      { timeout: 5000, timeoutMsg: "TSLA never appeared in the watchlist" },
    );
  });

  it("sorts the ledger by last price", async () => {
    await $('[data-testid="sort-price"]').click();

    await browser.waitUntil(
      async () =>
        (await $('[data-testid="sort-price"]').getAttribute("data-sort-state")) === "desc",
      { timeout: 5000, timeoutMsg: "the ledger did not switch to a descending sort" },
    );

    const firstRow = await $('[data-testid^="row-"]');
    const symbol = await firstRow.getAttribute("data-testid");
    expect(symbol).toBe("row-META");
  });

  it("carries the data disclaimer", async () => {
    // The footer labels are uppercased by CSS, and WebDriver reports rendered
    // text, so compare without case.
    const footer = (await $("footer").getText()).toLowerCase();
    expect(footer).toContain("not investment advice");
    expect(footer).toContain("simulated data");
  });
});
