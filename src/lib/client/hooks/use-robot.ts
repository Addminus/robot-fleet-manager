import { useQuery } from "@tanstack/react-query";
import { HttpError } from "@/lib/client/http-error";
import type { RobotResponse } from "@/lib/types/api";
import type { RobotDetails, RobotId } from "@/lib/types/robot";

export const fetchRobot = async (id: RobotId): Promise<RobotDetails> => {
  const result = await fetch(`/api/robots/${id}`);
  if (!result.ok) {
    throw new HttpError(
      `Failed to load robot (${result.status})`,
      result.status,
    );
  }
  const { robot } = (await result.json()) as RobotResponse;
  return robot;
};

export const useRobot = (id: RobotId) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["robot", id],
    queryFn: () => fetchRobot(id),
    // Note: This escalates the error to the next js error boundary.
    throwOnError: (_error, query) => query.state.data === undefined,
  });

  return {
    robot: data,
    robotRequestIsPending: isPending,
    robotRefreshFailed: isError,
  };
};
