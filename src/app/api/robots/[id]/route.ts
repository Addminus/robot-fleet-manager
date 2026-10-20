import {
  getRobotById,
  overrideRobot,
  toRobotSnapshot,
} from "@/lib/server/fleet-simulation-repository";
import type { SimulatedRobot } from "@/lib/server/simulated-robot";
import type {
  OperationalState,
  RobotDetails,
  RobotOverride,
} from "@/lib/types/robot";

export const dynamic = "force-dynamic"; // Note: This needs to be evaluated on every request

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const simulated = getRobotById(id);
  if (!simulated) {
    return Response.json({ error: "Robot not found" }, { status: 404 });
  }
  return Response.json(toRobotResponse(simulated));
}

// Note: Backs the developer controls only. Validation is kept basic, just enough that bad input can not crash the
// endpoint or reach the simulation. It enforces no business rules, any state is allowed from any state
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  // Note: Invalid JSON becomes undefined and fails the guard below
  const override: unknown = await request.json().catch(() => undefined);
  if (!isRobotOverride(override)) {
    return Response.json({ error: "Invalid override" }, { status: 400 });
  }
  const simulated = overrideRobot(id, override);
  if (!simulated) {
    return Response.json({ error: "Robot not found" }, { status: 404 });
  }
  return Response.json(toRobotResponse(simulated));
}

// Note: The detail page also needs the developer control flag, the rest of the simulation state stays on the server
const toRobotResponse = (simulated: SimulatedRobot): RobotDetails => ({
  ...toRobotSnapshot(simulated),
  isReportingBroken: simulated.isReportingBroken,
});

const operationalStates: unknown[] = [
  "idle",
  "working",
  "charging",
  "error",
] satisfies OperationalState[];

function isRobotOverride(value: unknown): value is RobotOverride {
  if (typeof value !== "object" || value === null) return false;
  const { operationalState, batteryPercent, isReportingBroken } =
    value as Record<string, unknown>;
  return (
    (operationalState === undefined ||
      operationalStates.includes(operationalState)) &&
    (batteryPercent === undefined || Number.isFinite(batteryPercent)) &&
    (isReportingBroken === undefined || typeof isReportingBroken === "boolean")
  );
}
