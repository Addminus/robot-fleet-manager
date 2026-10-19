"use client";

import { formatLastSeen } from "@/components/fleet/format-last-seen";
import { RobotLoading } from "@/components/robot/robot-loading";
import { RobotView } from "@/components/robot/robot-view";
import { getJobStatus } from "@/lib/client/helpers/get-job-status";
import { getRobotHealth } from "@/lib/client/helpers/get-robot-health";
import { useClock } from "@/lib/client/hooks/use-clock";
import { useLiveRobotTelemetry } from "@/lib/client/hooks/use-live-robot-telemetry";
import { useRobot } from "@/lib/client/hooks/use-robot";
import { useRobotOverride } from "@/lib/client/hooks/use-robot-override";
import type { RobotId } from "@/lib/types/robot";

type RobotContainerProps = {
  id: RobotId;
};

export const RobotContainer = ({ id }: RobotContainerProps) => {
  const { robot, robotRequestIsPending } = useRobot(id);
  const { liveTelemetry, liveTelemetryIsConnected } = useLiveRobotTelemetry(id);
  const now = useClock(1000);
  const {
    overrideRobot,
    overriddenIsReportingBroken,
    overrideIsPending,
    overrideFailed,
  } = useRobotOverride(id);
  if (robotRequestIsPending || !robot) return <RobotLoading />;

  // Note: The initial request provides a snapshot until the stream delivers its first report
  const telemetry = liveTelemetry ?? robot.telemetry;
  const lastUpdate = formatLastSeen(now - telemetry.observedAt);
  const jobStatus = getJobStatus(telemetry, now);
  const health = getRobotHealth(telemetry, now);

  return (
    <RobotView
      robot={robot.robot}
      telemetry={telemetry}
      lastUpdate={lastUpdate}
      isLost={health.status === "needs-attention" && health.reason === "lost"}
      liveUpdatesPaused={!liveTelemetryIsConnected}
      jobStatus={jobStatus}
      isReportingBroken={overriddenIsReportingBroken ?? robot.isReportingBroken}
      overrideIsPending={overrideIsPending}
      overrideFailed={overrideFailed}
      onOverride={overrideRobot}
    />
  );
};
