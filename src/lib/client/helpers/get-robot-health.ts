import type { OperationalState, RobotTelemetry } from "@/lib/types/robot";

// Note: client side assumption for simplicity. a better fix would be to get the update frequency for each vendor from the server and calculate based on those
export const STALE_THRESHOLD_MS = 20_000;

export type AttentionReason = "error" | "flat" | "lost";

export type HealthyState = Exclude<OperationalState, "error">;

// Note: Every robot is either healthy with a usable state, or needs attention for exactly one (the most severe) reason
export type RobotHealth =
  | { status: "healthy"; state: HealthyState }
  | { status: "needs-attention"; reason: AttentionReason };

export function getRobotHealth(
  telemetry: RobotTelemetry,
  now: number,
): RobotHealth {
  const { operationalState, batteryPercent, observedAt } = telemetry;
  if (operationalState === "error") {
    return { status: "needs-attention", reason: "error" };
  }
  if (batteryPercent <= 0) {
    return { status: "needs-attention", reason: "flat" };
  }
  if (now - observedAt > STALE_THRESHOLD_MS) {
    return { status: "needs-attention", reason: "lost" };
  }
  return { status: "healthy", state: operationalState };
}
