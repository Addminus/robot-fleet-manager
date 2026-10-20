import { NextResponse } from "next/server";
import {
  getFleet,
  toRobotSnapshot,
} from "@/lib/server/fleet-simulation-repository";
import type { FleetResponse } from "@/lib/types/api";

export const dynamic = "force-dynamic"; // Note: This needs to be evaluated on every request

export async function GET() {
  return NextResponse.json<FleetResponse>({
    fleet: getFleet().map(toRobotSnapshot),
  });
}
