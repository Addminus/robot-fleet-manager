import { describe, expect, it } from "vitest";
import {
  makeRobot,
  TEST_NOW as now,
} from "@/lib/client/helpers/__fixtures__/robot";
import { STALE_THRESHOLD_MS } from "@/lib/client/helpers/get-attention-reason";
import { getRobotsNeedingAttention } from "@/lib/client/helpers/get-robots-needing-attention";

describe("getRobotsNeedingAttention", () => {
  it("returns only robots needing attention, most severe first", () => {
    const fleet = [
      makeRobot(1, { observedAt: now - STALE_THRESHOLD_MS - 1 }),
      makeRobot(2),
      makeRobot(3, { batteryPercent: 0 }),
      makeRobot(4, { operationalState: "error" }),
    ];

    expect(
      getRobotsNeedingAttention(fleet, now).map(({ robot, reason }) => [
        robot.robot.id,
        reason,
      ]),
    ).toEqual([
      ["test-vendor:4", "error"],
      ["test-vendor:3", "flat"],
      ["test-vendor:1", "lost"],
    ]);
  });
});
