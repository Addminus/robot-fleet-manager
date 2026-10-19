"use client";

import { formatLastSeen } from "@/components/fleet/format-last-seen";
import { RobotLoading } from "@/components/robot/robot-loading";
import { RobotView } from "@/components/robot/robot-view";
import { useRobot } from "@/lib/client/hooks/use-robot";
import type { RobotId } from "@/lib/types/robot";

type RobotContainerProps = {
  id: RobotId;
};

export const RobotContainer = ({ id }: RobotContainerProps) => {
  const { robot, robotRequestIsPending } = useRobot(id);
  if (robotRequestIsPending || !robot) return <RobotLoading />;

  const lastUpdate = formatLastSeen(Date.now() - robot?.telemetry.observedAt);

  return <RobotView robot={robot} lastUpdate={lastUpdate} />;
};
