import type { SimulatedRobot } from "@/lib/types/robot";

// Note: Copies before sorting, since the fleet array is owned by the query cache and must not be mutated
export function getRobotsByLastSeen(fleet: SimulatedRobot[]): SimulatedRobot[] {
  return [...fleet].sort(
    (a, b) => b.telemetry.observedAt - a.telemetry.observedAt,
  );
}
