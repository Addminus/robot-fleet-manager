import { useMutation, useQueryClient } from "@tanstack/react-query";
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
    throw new Error(`Failed to override robot (${result.status})`);
  }
  const parsedResponse = (await result.json()) as { robot: SimulatedRobot };
  return parsedResponse.robot;
};

export const useRobotOverride = (id: RobotId) => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (override: RobotOverride) => sendRobotOverride(id, override),
    onSuccess: (robot) => queryClient.setQueryData(["robot", id], robot),
  });

  return {
    overrideRobot: mutate,
    overrideIsPending: isPending,
    overrideFailed: isError,
  };
};
