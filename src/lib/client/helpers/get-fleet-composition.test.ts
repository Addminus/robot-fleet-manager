import { describe, expect, it } from "vitest";
import {
  makeRobot,
  TEST_NOW as now,
} from "@/lib/client/helpers/__fixtures__/robot";
import { STALE_THRESHOLD_MS } from "@/lib/client/helpers/get-attention-reason";
import { getFleetComposition } from "@/lib/client/helpers/get-fleet-composition";

describe("getFleetComposition", () => {
  it("splits healthy robots by reported state and puts the rest into attention", () => {
    const fleet = [
      makeRobot(1, { operationalState: "working" }),
      makeRobot(2, { operationalState: "working" }),
      makeRobot(3, { operationalState: "idle" }),
      makeRobot(4, { operationalState: "charging" }),
      makeRobot(5, { operationalState: "error" }),
      makeRobot(6, { operationalState: "working", batteryPercent: 0 }),
      makeRobot(7, {
        operationalState: "working",
        observedAt: now - STALE_THRESHOLD_MS - 1,
      }),
    ];

    expect(getFleetComposition(fleet, now)).toEqual({
      working: 2,
      idle: 1,
      charging: 1,
      attention: 3,
    });
  });

  it("returns zero for buckets without robots", () => {
    expect(getFleetComposition([], now)).toEqual({
      working: 0,
      idle: 0,
      charging: 0,
      attention: 0,
    });
  });
});
