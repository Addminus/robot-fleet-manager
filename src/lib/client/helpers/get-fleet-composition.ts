import type { OperationalState, SimulatedRobot } from "@/lib/types/robot";

export type OperationalStateCounts = Record<OperationalState, number>;

export function getFleetComposition(
  fleet: SimulatedRobot[],
): OperationalStateCounts {
  const composition: OperationalStateCounts = {
    working: 0,
    idle: 0,
    charging: 0,
    error: 0,
  };
  for (const { telemetry } of fleet) {
    composition[telemetry.operationalState] += 1;
  }
  return composition;
}
