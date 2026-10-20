import { describe, expect, it } from "vitest";
import {
  makeRobot,
  TEST_NOW as now,
} from "@/lib/client/helpers/__fixtures__/robot";
import { getRobotsByLastSeen } from "@/lib/client/helpers/get-robots-by-last-seen";

describe("getRobotsByLastSeen", () => {
  it("orders robots from most to least recently seen without mutating the fleet", () => {
    const fleet = [
      makeRobot(1, { observedAt: now - 5_000 }),
      makeRobot(2, { observedAt: now }),
      makeRobot(3, { observedAt: now - 60_000 }),
    ];

    expect(getRobotsByLastSeen(fleet).map(({ id }) => id)).toEqual([
      "test-vendor:2",
      "test-vendor:1",
      "test-vendor:3",
    ]);
    expect(fleet.map(({ id }) => id)).toEqual([
      "test-vendor:1",
      "test-vendor:2",
      "test-vendor:3",
    ]);
  });
});
