import { createInitialFleet } from "@/lib/server/robot-factory";
import type { SimulatedRobot } from "@/lib/types/robot";

const createFleet = () => {
  return createInitialFleet(Date.now());
};

// Attaching this to global scope so that Nextjs hot reload does not recreate the fleet on every change
const globalScope = globalThis as unknown as {
  fleet?: ReturnType<typeof createFleet>;
};

export function getFleet() {
  globalScope.fleet ??= createFleet();
  return globalScope.fleet;
}

export function getRobotById(robotId: string) {
  globalScope.fleet ??= createFleet();
  const fleetByRobotId = new Map<string, SimulatedRobot>(
    globalScope.fleet.map((simulated) => [simulated.robot.id, simulated]),
  );
  return fleetByRobotId.get(robotId);
}
