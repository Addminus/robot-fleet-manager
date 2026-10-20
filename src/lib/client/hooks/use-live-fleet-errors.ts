import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useServerSentEvents } from "@/lib/client/hooks/use-server-sent-events";
import type { RobotSnapshot, RobotTelemetry } from "@/lib/types/robot";

export const useLiveFleetErrors = () => {
  const queryClient = useQueryClient();
  const [latestError, setLatestError] = useState<RobotTelemetry>();

  useServerSentEvents<RobotTelemetry>("/api/robots/stream", (telemetry) => {
    // Note: Patches new errors into the cached fleet so the attention views react instantly. Polling stays the source of truth
    queryClient.setQueryData<RobotSnapshot[]>(["fleet"], (fleet) =>
      fleet?.map((snapshot) =>
        snapshot.id === telemetry.robotId
          ? { ...snapshot, latestTelemetry: telemetry }
          : snapshot,
      ),
    );
    setLatestError(telemetry);
  });

  return {
    latestError,
    dismissLatestError: () => setLatestError(undefined),
  };
};
