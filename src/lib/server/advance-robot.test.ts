import { describe, expect, it } from "vitest";
import { advanceRobot } from "@/lib/server/advance-robot";
import type { SimulatedRobot } from "@/lib/server/simulated-robot";
import type { RobotTelemetry } from "@/lib/types/robot";

const makeSimulatedRobot = (
  telemetry: Partial<RobotTelemetry>,
): SimulatedRobot => ({
  robot: { id: "test-vendor:01", displayName: "Test 01", vendorId: "test" },
  telemetry: {
    robotId: "test-vendor:01",
    observedAt: 0,
    batteryPercent: 80,
    operationalState: "working",
    ...telemetry,
  },
  batteryDrainPerSecond: 1,
  workDurationInMilliseconds: 60_000,
  idleDurationInMilliseconds: 30_000,
  stateEndsAt: 60_000,
  isReportingBroken: false,
});

// Note: The UI derives staleness from observedAt, so reading a robot must never make it look fresher than its vendor reports
describe("advanceRobot", () => {
  it("sets observedAt to the last vendor report, not the read time", () => {
    const simulated = makeSimulatedRobot({});

    advanceRobot(simulated, 2000, 5500);

    expect(simulated.telemetry.observedAt).toBe(4000);
  });

  it("stops reporting once the battery is flat, so the robot goes stale", () => {
    const simulated = makeSimulatedRobot({ batteryPercent: 0 });

    advanceRobot(simulated, 2000, 60_000);

    expect(simulated.telemetry.observedAt).toBe(0);
  });

  it("sends no reports while reporting is broken, then catches up once restored", () => {
    const simulated = makeSimulatedRobot({});
    simulated.isReportingBroken = true;

    advanceRobot(simulated, 2000, 30_000);
    expect(simulated.telemetry.observedAt).toBe(0);

    simulated.isReportingBroken = false;
    advanceRobot(simulated, 2000, 30_000);
    expect(simulated.telemetry.observedAt).toBe(30_000);
  });
});
