import { getFleet } from "@/lib/server/fleet-repository";

export const dynamic = "force-dynamic"; // Note: This needs to be evaluated on every request

export async function GET() {
  const fleet = getFleet();
  return Response.json({
    fleet,
  });
}
