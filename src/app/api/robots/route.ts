import {
  getFleet,
  toRobotSnapshot,
} from "@/lib/server/fleet-simulation-repository";

export const dynamic = "force-dynamic"; // Note: This needs to be evaluated on every request

export async function GET() {
  return Response.json({
    fleet: getFleet().map(toRobotSnapshot),
  });
}
