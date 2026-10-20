import type { Robot, RobotTelemetry } from "@/lib/types/robot";

// Helper type to be able to store current state of robot. Server only, the API sends RobotSnapshot instead
export interface SimulatedRobot {
  robot: Robot;
  telemetry: RobotTelemetry;
  batteryDrainPerSecond: number;
  workDurationInMilliseconds: number;
  idleDurationInMilliseconds: number;
  stateEndsAt: number | null; // Note: null while charging or in error, as those have no fixed end
  isReportingBroken: boolean; // Note: Developer control. The robot keeps running but sends no reports
}
