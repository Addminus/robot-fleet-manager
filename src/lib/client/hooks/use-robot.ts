import { useQuery } from "@tanstack/react-query";
import type { RobotId, SimulatedRobot } from "@/lib/types/robot";

const ROBOT_POLL_INTERVAL_MS = 10_000;

export const fetchRobot = async (id: string): Promise<SimulatedRobot> => {
  const result = await fetch(`/api/robots/${id}`);
  if (!result.ok) {
    throw new Error(`Failed to load robot (${result.status})`);
  }
  const parsedResponse = (await result.json()) as {
    robot: SimulatedRobot;
  };
  return parsedResponse.robot;
};

export const useRobot = (id: RobotId) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["robot", id],
    queryFn: () => fetchRobot(id),
    refetchInterval: ROBOT_POLL_INTERVAL_MS,
    // Note: This escalates the error to the next js error boundary.
    throwOnError: (_error, query) => query.state.data === undefined,
  });

  return {
    robot: data,
    robotRequestIsPending: isPending,
    robotRefreshFailed: isError,
  };
};
