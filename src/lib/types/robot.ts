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

// Note: What the API sends per robot. The simulation state stays on the server
export type RobotSnapshot = Robot & { latestTelemetry: RobotTelemetry };

// Note: What the robot detail endpoint sends. The developer controls also need to know whether reporting is broken
export type RobotDetails = RobotSnapshot & { isReportingBroken: boolean };

// Note: Developer override of a simulated robot. observedAt is left out on purpose, it only moves with real reports
export type RobotOverride = Partial<
  Pick<RobotTelemetry, "operationalState" | "batteryPercent">
> & { isReportingBroken?: boolean };
