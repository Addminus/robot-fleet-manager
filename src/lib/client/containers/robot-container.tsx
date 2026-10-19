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
  const { robot, robotRequestIsPending, robotUpdatedAt } = useRobot(id);
  const lastUpdate = formatLastSeen(Date.now() - robotUpdatedAt);

  if (robotRequestIsPending || !robot) return <RobotLoading />;

  return <RobotView robot={robot} lastUpdate={lastUpdate} />;
};
