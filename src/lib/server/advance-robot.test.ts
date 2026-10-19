import { afterEach, describe, expect, it, vi } from "vitest";
import { advanceRobot } from "@/lib/server/advance-robot";
import type { RobotTelemetry, SimulatedRobot } from "@/lib/types/robot";

const INTERVAL = 1000;

const makeSimulatedRobot = (
  telemetry: Partial<RobotTelemetry>,
  stateEndsAt: number | null = null,
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
  stateEndsAt,
});

describe("advanceRobot", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("reports once per elapsed interval and drains while working", () => {
    const simulated = makeSimulatedRobot({}, 60_000);

    advanceRobot(simulated, INTERVAL, 3500);

    expect(simulated.telemetry.observedAt).toBe(3000);
    expect(simulated.telemetry.batteryPercent).toBe(77);
  });

  it("switches from working to idle when the work block ends", () => {
    const simulated = makeSimulatedRobot({}, 1000);

    advanceRobot(simulated, INTERVAL, 1000);

    expect(simulated.telemetry.operationalState).toBe("idle");
    expect(simulated.stateEndsAt).toBe(31_000);
  });

  it("can fail with an error when a work block starts", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const simulated = makeSimulatedRobot({ operationalState: "idle" }, 1000);

    advanceRobot(simulated, INTERVAL, 1000);

    expect(simulated.telemetry.operationalState).toBe("error");
    expect(simulated.stateEndsAt).toBeNull();
  });

  it("charges when the battery runs low and resumes work when full", () => {
    const simulated = makeSimulatedRobot({ batteryPercent: 21 }, 60_000);

    advanceRobot(simulated, INTERVAL, 1000);
    expect(simulated.telemetry.operationalState).toBe("charging");

    advanceRobot(simulated, INTERVAL, 31_000);
    expect(simulated.telemetry.operationalState).toBe("working");
    expect(simulated.telemetry.batteryPercent).toBeGreaterThanOrEqual(95);
  });

  it("does not report once the battery is flat", () => {
    const simulated = makeSimulatedRobot({ batteryPercent: 0 }, 60_000);

    advanceRobot(simulated, INTERVAL, 5000);

    expect(simulated.telemetry.observedAt).toBe(0);
  });
});
