import type { Metadata } from "next";
import { APP_NAME } from "@/lib/client/config";
import { RobotContainer } from "@/lib/client/containers/robot-container";
import type { RobotId } from "@/lib/types/robot";

export const metadata: Metadata = {
  title: `${APP_NAME} | Detail`,
};

type RobotDetailProps = {
  params: Promise<{ robotId: RobotId }>;
};

export default async function RobotDetail({ params }: RobotDetailProps) {
  const { robotId } = await params;
  const decodedRobotId = decodeURIComponent(robotId) as RobotId;
  // Note: Route params arrive URL-encoded, so "vendor:01" comes in as "vendor%3A01"
  return <RobotContainer id={decodedRobotId} />;
}
