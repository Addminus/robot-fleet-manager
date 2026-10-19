import { useEffect, useState } from "react";
import type { RobotId, RobotTelemetry } from "@/lib/types/robot";

export const useLiveRobotTelemetry = (id: RobotId) => {
  const [telemetry, setTelemetry] = useState<RobotTelemetry>();

  useEffect(() => {
    const source = new EventSource(`/api/robots/${id}/stream`);
    source.onmessage = (event) => {
      setTelemetry(JSON.parse(event.data) as RobotTelemetry);
    };
    return () => source.close();
  }, [id]);

  console.log(telemetry);

  // Note: Ignore telemetry left over from any previous robot until the new stream reports
  return telemetry?.robotId === id ? telemetry : undefined;
};
