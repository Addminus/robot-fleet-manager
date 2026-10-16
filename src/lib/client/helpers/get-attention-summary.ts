import type { SimulatedRobot } from "@/lib/types/robot";

// Note: client side assumption for simplicity. a better fix would be to get the update frequency for each vendor from the server and calculate based on those
export const STALE_THRESHOLD_MS = 20_000;

export type AttentionCounts = {
  total: number;
  error: number;
  flat: number;
  lost: number;
};

// Note: Each robot is counted once, using the most severe reason
export function getAttentionSummary(
  fleet: SimulatedRobot[],
  now: number,
): AttentionCounts {
  const summary = { error: 0, flat: 0, lost: 0 };
  for (const { telemetry } of fleet) {
    if (telemetry.operationalState === "error") summary.error += 1;
    else if (telemetry.batteryPercent <= 0) summary.flat += 1;
    else if (now - telemetry.observedAt > STALE_THRESHOLD_MS) summary.lost += 1;
  }

  return {
    ...summary,
    total: summary.error + summary.flat + summary.lost,
  };
}
