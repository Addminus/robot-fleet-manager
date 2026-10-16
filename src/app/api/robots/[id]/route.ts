import { getRobotById } from "@/lib/server/fleet-repository";

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
