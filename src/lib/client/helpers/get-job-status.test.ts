import { describe, expect, it } from "vitest";
import {
  makeRobot,
  TEST_NOW as now,
} from "@/lib/client/helpers/__fixtures__/robot";
import { getJobStatus } from "@/lib/client/helpers/get-job-status";

describe("getJobStatus", () => {
  it("warns that a charge is coming when a working robot runs low", () => {
    const { telemetry } = makeRobot(1, { batteryPercent: 25 });

    expect(getJobStatus(telemetry, now)).toEqual({
      working: "active",
      idle: "inactive",
      message: "Battery low, charging soon.",
    });
  });

  it("pauses the work job while charging", () => {
    const { telemetry } = makeRobot(1, { operationalState: "charging" });

    expect(getJobStatus(telemetry, now)).toMatchObject({
      working: "paused",
      idle: "inactive",
    });
  });

  it("disables both jobs when the robot needs attention, even if it last reported working", () => {
    const { telemetry } = makeRobot(1, { batteryPercent: 0 });

    expect(getJobStatus(telemetry, now)).toEqual({
      working: "disabled",
      idle: "disabled",
      message: "Current task aborted, battery flat.",
    });
  });
});
