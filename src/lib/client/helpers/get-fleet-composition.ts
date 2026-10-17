import {
  getRobotHealth,
  type HealthyState,
} from "@/lib/client/helpers/get-robot-health";
import type { SimulatedRobot } from "@/lib/types/robot";

export type RobotStatus = HealthyState | "attention";

export type RobotStatusCounts = Record<RobotStatus, number>;

export function getFleetComposition(
  fleet: SimulatedRobot[],
  now: number,
): RobotStatusCounts {
  const composition: RobotStatusCounts = {
    working: 0,
    idle: 0,
    charging: 0,
    attention: 0,
  };
  for (const { telemetry } of fleet) {
    const health = getRobotHealth(telemetry, now);
    if (health.status === "healthy") {
      composition[health.state] += 1;
    } else {
      composition.attention += 1;
    }
  }
  return composition;
}
