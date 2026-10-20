import {
  getRobotHealth,
  type HealthyState,
} from "@/lib/client/helpers/get-robot-health";
import type { RobotSnapshot } from "@/lib/types/robot";

export type RobotStatus = HealthyState | "attention";

export type RobotStatusCounts = Record<RobotStatus, number>;

export function getFleetComposition(
  fleet: RobotSnapshot[],
  now: number,
): RobotStatusCounts {
  const composition: RobotStatusCounts = {
    working: 0,
    idle: 0,
    charging: 0,
    attention: 0,
  };
  for (const { latestTelemetry } of fleet) {
    const health = getRobotHealth(latestTelemetry, now);
    if (health.status === "healthy") {
      composition[health.state] += 1;
    } else {
      composition.attention += 1;
    }
  }
  return composition;
}
