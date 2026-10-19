import {
  getRobotById,
  overrideRobot,
} from "@/lib/server/fleet-simulation-repository";
import type { OperationalState, RobotOverride } from "@/lib/types/robot";

export const dynamic = "force-dynamic"; // Note: This needs to be evaluated on every request

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const robot = getRobotById(id);
  if (!robot) {
    return Response.json({ error: "Robot not found" }, { status: 404 });
  }
  return Response.json({
    robot,
  });
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
  const robot = overrideRobot(id, override);
  if (!robot) {
    return Response.json({ error: "Robot not found" }, { status: 404 });
  }
  return Response.json({
    robot,
  });
}

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
