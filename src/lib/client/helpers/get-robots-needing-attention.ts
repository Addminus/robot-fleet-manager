import {
  type AttentionReason,
  getRobotHealth,
} from "@/lib/client/helpers/get-robot-health";
import type { SimulatedRobot } from "@/lib/types/robot";

export type RobotNeedingAttention = {
  robot: SimulatedRobot;
  reason: AttentionReason;
};

const severityOrder: AttentionReason[] = ["error", "flat", "lost"];

// Note: Sorted by severity so the most urgent robots are at the top of the table
export function getRobotsNeedingAttention(
  fleet: SimulatedRobot[],
  now: number,
): RobotNeedingAttention[] {
  const robotsNeedingAttention: RobotNeedingAttention[] = [];
  for (const robot of fleet) {
    const health = getRobotHealth(robot.telemetry, now);
    if (health.status === "needs-attention") {
      robotsNeedingAttention.push({ robot, reason: health.reason });
    }
  }

  return robotsNeedingAttention.sort(
    (a, b) => severityOrder.indexOf(a.reason) - severityOrder.indexOf(b.reason),
  );
}
