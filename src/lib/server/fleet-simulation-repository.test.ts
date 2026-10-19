import { beforeEach, describe, expect, it } from "vitest";
import { getFleet, getRobotById } from "@/lib/server/fleet-repository";
import { vendorProfiles } from "@/lib/server/vendor-profiles";

describe("fleet-repository", () => {
  beforeEach(() => {
    // The fleet is cached on globalThis, so reset it to keep tests independent
    delete (globalThis as { fleet?: unknown }).fleet;
  });

  it("getFleet returns a robot for every configured vendor robot", () => {
    const expectedSize = vendorProfiles.reduce(
      (total, vendor) => total + vendor.robotCount,
      0,
    );

    expect(getFleet()).toHaveLength(expectedSize);
  });

  it("getRobotById returns the matching robot", () => {
    const simulated = getRobotById("cryotec:02");

    expect(simulated?.robot).toEqual({
      id: "cryotec:02",
      displayName: "Cryotec 02",
      vendorId: "cryotec",
    });
  });

  it("getRobotById returns undefined for an unknown id", () => {
    expect(getRobotById("unknown:99")).toBeUndefined();
  });
});
