import { useState } from "react";
import { useServerSentEvents } from "@/lib/client/hooks/use-server-sent-events";
import type { RobotId, RobotTelemetry } from "@/lib/types/robot";

export const useLiveRobotTelemetry = (id: RobotId) => {
  const [telemetry, setTelemetry] = useState<RobotTelemetry>();

  useServerSentEvents<RobotTelemetry>(`/api/robots/${id}/stream`, setTelemetry);

  // Note: Ignore telemetry left over from any previous robot until the new stream reports
  return telemetry?.robotId === id ? telemetry : undefined;
};
