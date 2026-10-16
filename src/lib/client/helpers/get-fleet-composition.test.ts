import { describe, expect, it } from "vitest";
import { makeRobot } from "@/lib/client/helpers/__fixtures__/robot";
import { getFleetComposition } from "@/lib/client/helpers/get-fleet-composition";

describe("getFleetComposition", () => {
  it("counts robots per reported operational state", () => {
    const fleet = [
      makeRobot(1, { operationalState: "working" }),
      makeRobot(2, { operationalState: "working" }),
      makeRobot(3, { operationalState: "idle" }),
      makeRobot(4, { operationalState: "charging" }),
      makeRobot(5, { operationalState: "error" }),
    ];

    expect(getFleetComposition(fleet)).toEqual({
      working: 2,
      idle: 1,
      charging: 1,
      error: 1,
    });
  });

  it("returns zero for states without robots", () => {
    expect(getFleetComposition([])).toEqual({
      working: 0,
      idle: 0,
      charging: 0,
      error: 0,
    });
  });
});
