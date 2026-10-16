import { describe, expect, it } from "vitest";
import {
  makeRobot,
  TEST_NOW as now,
} from "@/lib/client/helpers/__fixtures__/robot";
import { STALE_THRESHOLD_MS } from "@/lib/client/helpers/get-attention-reason";
import { getAttentionSummary } from "@/lib/client/helpers/get-attention-summary";

describe("getAttentionSummary", () => {
  it("counts error, flat and lost robots and ignores healthy ones", () => {
    const fleet = [
      makeRobot(1),
      makeRobot(2, { operationalState: "error" }),
      makeRobot(3, { batteryPercent: 0 }),
      makeRobot(4, { observedAt: now - STALE_THRESHOLD_MS - 1 }),
    ];

    expect(getAttentionSummary(fleet, now)).toEqual({
      total: 3,
      error: 1,
      flat: 1,
      lost: 1,
    });
  });

  it("counts a robot with several problems only once, by its most severe reason", () => {
    const fleet = [
      makeRobot(1, {
        operationalState: "error",
        batteryPercent: 0,
        observedAt: now - STALE_THRESHOLD_MS - 1,
      }),
      makeRobot(2, {
        batteryPercent: 0,
        observedAt: now - STALE_THRESHOLD_MS - 1,
      }),
    ];

    expect(getAttentionSummary(fleet, now)).toEqual({
      total: 2,
      error: 1,
      flat: 1,
      lost: 0,
    });
  });
});
