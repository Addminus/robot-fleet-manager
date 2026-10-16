import { createInitialFleet } from "@/lib/server/robot-factory";

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
