import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useServerSentEvents } from "@/lib/client/hooks/use-server-sent-events";
import type { RobotTelemetry, SimulatedRobot } from "@/lib/types/robot";

export const useLiveFleetErrors = () => {
  const queryClient = useQueryClient();
  const [latestError, setLatestError] = useState<RobotTelemetry>();

  useServerSentEvents<RobotTelemetry>("/api/robots/stream", (telemetry) => {
    // Note: Patches new errors into the cached fleet so the attention views react instantly. Polling stays the source of truth
    queryClient.setQueryData<SimulatedRobot[]>(["fleet"], (fleet) =>
      fleet?.map((simulated) =>
        simulated.robot.id === telemetry.robotId
          ? { ...simulated, telemetry }
          : simulated,
      ),
    );
    setLatestError(telemetry);
  });

  return {
    latestError,
    dismissLatestError: () => setLatestError(undefined),
  };
};
