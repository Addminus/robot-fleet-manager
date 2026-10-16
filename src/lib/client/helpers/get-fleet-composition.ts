import { getAttentionReason } from "@/lib/client/helpers/get-attention-reason";
import type { OperationalState, SimulatedRobot } from "@/lib/types/robot";

export type RobotStatus = Exclude<OperationalState, "error"> | "attention";

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
    // Note: getAttentionReason already covers error; the explicit check lets TypeScript narrow the state below
    if (
      telemetry.operationalState === "error" ||
      getAttentionReason(telemetry, now)
    ) {
      composition.attention += 1;
    } else {
      composition[telemetry.operationalState] += 1;
    }
  }
  return composition;
}
