import { getRobotHealth } from "@/lib/client/helpers/get-robot-health";
import type { SimulatedRobot } from "@/lib/types/robot";

export type AttentionCounts = {
  total: number;
  error: number;
  flat: number;
  lost: number;
};

export function getAttentionSummary(
  fleet: SimulatedRobot[],
  now: number,
): AttentionCounts {
  const summary = { error: 0, flat: 0, lost: 0 };
  for (const { telemetry } of fleet) {
    const health = getRobotHealth(telemetry, now);
    if (health.status === "needs-attention") summary[health.reason] += 1;
  }

  return {
    ...summary,
    total: summary.error + summary.flat + summary.lost,
  };
}
