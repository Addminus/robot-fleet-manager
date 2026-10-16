import { describe, expect, it } from "vitest";
import { createInitialFleet } from "@/lib/server/robot-factory";
import type { VendorProfile } from "@/lib/server/vendor-profiles";

const testProfile: VendorProfile = {
  id: "test-vendor",
  displayName: "Test Vendor",
  updateIntervalInMilliseconds: 1000,
  robotCount: 2,
};

describe("createInitialFleet", () => {
  it("creates one robot per robotCount of each vendor profile", () => {
    const fleet = createInitialFleet(Date.now(), [testProfile]);

    expect(fleet).toHaveLength(2);
    expect(fleet.map((simulated) => simulated.robot.id)).toEqual([
      "test-vendor:01",
      "test-vendor:02",
    ]);
    for (const simulated of fleet) {
      expect(simulated.telemetry.robotId).toBe(simulated.robot.id);
    }
  });
});
