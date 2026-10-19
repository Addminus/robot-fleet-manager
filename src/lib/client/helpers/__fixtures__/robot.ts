import type { RobotTelemetry, SimulatedRobot } from "@/lib/types/robot";

export const TEST_NOW = 1_000_000;

export const makeRobot = (
  number: number,
  telemetry: Partial<RobotTelemetry> = {},
  now: number = TEST_NOW,
): SimulatedRobot => {
  const id = `test-vendor:${number}` as const;
  return {
    robot: { id, displayName: `Test ${number}`, vendorId: "test-vendor" },
    telemetry: {
      robotId: id,
      observedAt: now,
      batteryPercent: 80,
      operationalState: "working",
      ...telemetry,
    },
    batteryDrainPerSecond: 1,
    workDurationInMilliseconds: 60_000,
    idleDurationInMilliseconds: 30_000,
    stateEndsAt: null,
  };
};
