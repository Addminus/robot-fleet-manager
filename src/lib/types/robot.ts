export type RobotId = `${string}:${string}`; // Note: expecting to use combination of vendor id and robot number here

export type Robot = {
  id: RobotId;
  displayName: string;
  vendorId: string;
};

export type OperationalState = "idle" | "working" | "charging" | "error";

export interface RobotTelemetry {
  robotId: RobotId;
  observedAt: number;
  batteryPercent: number;
  operationalState: OperationalState;
}

// Helper type to be able to store current state of robot
export interface SimulatedRobot {
  robot: Robot;
  telemetry: RobotTelemetry;
  batteryDrainPerSecond: number;
  workDurationInMilliseconds: number;
  idleDurationInMilliseconds: number;
  stateEndsAt: number | null; // Note: null while charging or in error, as those have no fixed end
}
