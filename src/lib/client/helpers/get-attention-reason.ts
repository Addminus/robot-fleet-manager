import type { RobotTelemetry } from "@/lib/types/robot";

// Note: client side assumption for simplicity. a better fix would be to get the update frequency for each vendor from the server and calculate based on those
export const STALE_THRESHOLD_MS = 20_000;

export type AttentionReason = "error" | "flat" | "lost";

// Note: Each robot is counted once, using the most severe reason
export function getAttentionReason(
  telemetry: RobotTelemetry,
  now: number,
): AttentionReason | undefined {
  if (telemetry.operationalState === "error") return "error";
  if (telemetry.batteryPercent <= 0) return "flat";
  if (now - telemetry.observedAt > STALE_THRESHOLD_MS) return "lost";
  return undefined;
}
