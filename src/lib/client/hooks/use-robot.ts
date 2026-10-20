import { useQuery } from "@tanstack/react-query";
import { HttpError } from "@/lib/client/http-error";
import type { RobotId, RobotSnapshot } from "@/lib/types/robot";

export type RobotDetails = RobotSnapshot & { isReportingBroken: boolean };

export const fetchRobot = async (id: RobotId): Promise<RobotDetails> => {
  const result = await fetch(`/api/robots/${id}`);
  if (!result.ok) {
    throw new HttpError(
      `Failed to load robot (${result.status})`,
      result.status,
    );
  }
  return (await result.json()) as RobotDetails;
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
