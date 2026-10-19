"use client";

import { formatLastSeen } from "@/components/fleet/format-last-seen";
import { RobotLoading } from "@/components/robot/robot-loading";
import { RobotView } from "@/components/robot/robot-view";
import { useClock } from "@/lib/client/hooks/use-clock";
import { useLiveRobotTelemetry } from "@/lib/client/hooks/use-live-robot-telemetry";
import { useRobot } from "@/lib/client/hooks/use-robot";
import type { RobotId } from "@/lib/types/robot";

type RobotContainerProps = {
  id: RobotId;
};

export const RobotContainer = ({ id }: RobotContainerProps) => {
  const { robot, robotRequestIsPending } = useRobot(id);
  const liveTelemetry = useLiveRobotTelemetry(id);
  const now = useClock(1000);
  if (robotRequestIsPending || !robot) return <RobotLoading />;

  // Note: The initial request provides a snapshot until the stream delivers its first report
  const telemetry = liveTelemetry ?? robot.telemetry;
  const lastUpdate = formatLastSeen(now - telemetry.observedAt);

  return (
    <RobotView
      robot={robot.robot}
      telemetry={telemetry}
      lastUpdate={lastUpdate}
    />
  );
};
