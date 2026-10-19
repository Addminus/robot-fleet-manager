import { useQuery } from "@tanstack/react-query";
import { HttpError } from "@/lib/client/http-error";
import type { SimulatedRobot } from "@/lib/types/robot";

const FLEET_POLL_INTERVAL_MS = 10_000;

export const fetchFleet = async (): Promise<SimulatedRobot[]> => {
  const result = await fetch("/api/robots");
  // Note: fetch only rejects on network failures, so HTTP errors have to be thrown manually for the query to fail
  if (!result.ok) {
    throw new HttpError(
      `Failed to load fleet (${result.status})`,
      result.status,
    );
  }
  const parsedResponse = (await result.json()) as {
    fleet: SimulatedRobot[];
  };
  return parsedResponse.fleet;
};

export const useFleet = () => {
  const { data, dataUpdatedAt, isPending, isError } = useQuery({
    queryKey: ["fleet"],
    queryFn: fetchFleet,
    refetchInterval: FLEET_POLL_INTERVAL_MS,
    // Note: This escalates the error to the next js error boundary.
    throwOnError: (_error, query) => query.state.data === undefined,
  });

  return {
    fleet: data ?? [],
    // Note: Timestamp of the last successful fetch, used as reference point for telemetry staleness
    fleetUpdatedAt: dataUpdatedAt,
    fleetRequestIsPending: isPending,
    fleetRefreshFailed: isError,
  };
};
