import { advanceRobot, enterState } from "@/lib/server/advance-robot";
import { createInitialFleet } from "@/lib/server/robot-factory";
import { vendorProfilesById } from "@/lib/server/vendor-profiles";
import type { RobotOverride, SimulatedRobot } from "@/lib/types/robot";

const createFleetSimulation = () => {
  const fleet = createInitialFleet(Date.now());
  const fleetByRobotId = new Map<string, SimulatedRobot>(
    fleet.map((simulated) => [simulated.robot.id, simulated]),
  );
  return { fleet, fleetByRobotId };
};

// Attaching this to global scope so that Nextjs hot reload does not recreate the fleet on every change
const globalScope = globalThis as unknown as {
  fleetSimulation?: ReturnType<typeof createFleetSimulation>;
};

const getFleetSimulation = () => {
  globalScope.fleetSimulation ??= createFleetSimulation();
  return globalScope.fleetSimulation;
};

// Note: Going via the vendor as only its profile knows the update interval.
const advanceToNow = (simulated: SimulatedRobot, now: number) => {
  const vendor = vendorProfilesById.get(simulated.robot.vendorId);
  if (!vendor) return;
  advanceRobot(simulated, vendor.updateIntervalInMilliseconds, now);
};

export function getFleet() {
  const { fleet } = getFleetSimulation();
  const now = Date.now();
  for (const simulated of fleet) {
    advanceToNow(simulated, now);
  }
  return fleet;
}

export function getRobotById(robotId: string) {
  const simulated = getFleetSimulation().fleetByRobotId.get(robotId);
  if (simulated) {
    advanceToNow(simulated, Date.now());
  }
  return simulated;
}

// Note: Writes the override into the stored robot. advanceRobot picks it up with the next report
export function overrideRobot(robotId: string, override: RobotOverride) {
  const simulated = getRobotById(robotId);
  if (!simulated) return undefined;

  if (override.operationalState !== undefined) {
    enterState(simulated, override.operationalState, Date.now());
  }
  if (override.batteryPercent !== undefined) {
    simulated.telemetry.batteryPercent = Math.min(
      100,
      Math.max(0, override.batteryPercent),
    );
  }
  if (override.isReportingBroken !== undefined) {
    simulated.isReportingBroken = override.isReportingBroken;
  }
  return simulated;
}
