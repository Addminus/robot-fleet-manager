import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { RobotTelemetry, SimulatedRobot } from "@/lib/types/robot";

// Note: Patches new errors into the cached fleet so the attention views react instantly. Polling stays the source of truth
export const useLiveFleetErrors = () => {
  const queryClient = useQueryClient();
  const [latestError, setLatestError] = useState<RobotTelemetry>();

  useEffect(() => {
    const source = new EventSource("/api/robots/stream");
    source.onmessage = (event) => {
      const telemetry = JSON.parse(event.data) as RobotTelemetry;
      queryClient.setQueryData<SimulatedRobot[]>(["fleet"], (fleet) =>
        fleet?.map((simulated) =>
          simulated.robot.id === telemetry.robotId
            ? { ...simulated, telemetry }
            : simulated,
        ),
      );
      setLatestError(telemetry);
    };
    return () => source.close();
  }, [queryClient]);

  return {
    latestError,
    dismissLatestError: () => setLatestError(undefined),
  };
};
