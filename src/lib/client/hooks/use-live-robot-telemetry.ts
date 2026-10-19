import { useState } from "react";
import { useServerSentEvents } from "@/lib/client/hooks/use-server-sent-events";
import type { RobotId, RobotTelemetry } from "@/lib/types/robot";

export const useLiveRobotTelemetry = (id: RobotId) => {
  const [telemetry, setTelemetry] = useState<RobotTelemetry>();

  const { isConnected } = useServerSentEvents<RobotTelemetry>(
    `/api/robots/${id}/stream`,
    setTelemetry,
  );

  return {
    // Note: Ignore telemetry left over from any previous robot until the new stream reports
    liveTelemetry: telemetry?.robotId === id ? telemetry : undefined,
    liveTelemetryIsConnected: isConnected,
  };
};
