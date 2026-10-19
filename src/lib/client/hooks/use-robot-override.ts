import { useMutation } from "@tanstack/react-query";
import { HttpError } from "@/lib/client/http-error";
import type { RobotId, RobotOverride, SimulatedRobot } from "@/lib/types/robot";

const sendRobotOverride = async (
  id: RobotId,
  override: RobotOverride,
): Promise<SimulatedRobot> => {
  const result = await fetch(`/api/robots/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(override),
  });
  if (!result.ok) {
    throw new HttpError(
      `Failed to override robot (${result.status})`,
      result.status,
    );
  }
  const parsedResponse = (await result.json()) as { robot: SimulatedRobot };
  return parsedResponse.robot;
};

export const useRobotOverride = (id: RobotId) => {
  const { mutate, data, isPending, isError } = useMutation({
    mutationFn: (override: RobotOverride) => sendRobotOverride(id, override),
  });

  return {
    overrideRobot: mutate,
    // Note: Telemetry is left out on purpose. It holds values the robot has not reported yet, the stream delivers them with the next report.
    // The id check ignores a result left over from a previously viewed robot
    overriddenIsReportingBroken:
      data?.robot.id === id ? data.isReportingBroken : undefined,
    overrideIsPending: isPending,
    overrideFailed: isError,
  };
};
