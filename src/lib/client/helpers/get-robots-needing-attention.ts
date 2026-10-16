import {
  type AttentionReason,
  getAttentionReason,
} from "@/lib/client/helpers/get-attention-reason";
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
    const reason = getAttentionReason(robot.telemetry, now);
    if (reason) robotsNeedingAttention.push({ robot, reason });
  }

  return robotsNeedingAttention.sort(
    (a, b) => severityOrder.indexOf(a.reason) - severityOrder.indexOf(b.reason),
  );
}
