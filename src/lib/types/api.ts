import type { RobotDetails, RobotSnapshot } from "@/lib/types/robot";

export type FleetResponse = { fleet: RobotSnapshot[] };

// Note: For reads and developer overrides alike
export type RobotResponse = { robot: RobotDetails };

export type ErrorResponse = { error: string };
