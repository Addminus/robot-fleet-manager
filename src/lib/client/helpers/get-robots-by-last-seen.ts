import type { RobotSnapshot } from "@/lib/types/robot";

// Note: Copies before sorting, since the fleet array is owned by the query cache and must not be mutated
export function getRobotsByLastSeen(fleet: RobotSnapshot[]): RobotSnapshot[] {
  return [...fleet].sort(
    (a, b) => b.latestTelemetry.observedAt - a.latestTelemetry.observedAt,
  );
}
