import { describe, expect, it } from "vitest";
import { getSessionInfo } from "@/lib/market/session";

// 2 November 2026 is a Monday and daylight saving has ended, so New York is
// UTC-5 for every case below.
describe("getSessionInfo", () => {
  it("opens at 09:30 New York time", () => {
    expect(getSessionInfo(new Date("2026-11-02T14:30:00Z")).state).toBe("open");
    expect(getSessionInfo(new Date("2026-11-02T14:29:00Z")).state).toBe("pre");
  });

  it("labels the pre-market window", () => {
    const info = getSessionInfo(new Date("2026-11-02T13:00:00Z"));
    expect(info.state).toBe("pre");
    expect(info.label).toBe("Pre-market");
  });

  it("moves to after hours at 16:00 New York time", () => {
    expect(getSessionInfo(new Date("2026-11-02T20:59:00Z")).state).toBe("open");
    expect(getSessionInfo(new Date("2026-11-02T21:00:00Z")).state).toBe("after");
  });

  it("closes after 20:00 New York time", () => {
    expect(getSessionInfo(new Date("2026-11-03T01:00:00Z")).state).toBe("closed");
  });

  it("closes for the weekend", () => {
    expect(getSessionInfo(new Date("2026-11-07T15:00:00Z")).state).toBe("closed");
    expect(getSessionInfo(new Date("2026-11-08T15:00:00Z")).state).toBe("closed");
  });
});
