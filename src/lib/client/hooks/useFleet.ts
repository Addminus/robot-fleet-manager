import { useQuery } from "@tanstack/react-query";
import type { SimulatedRobot } from "@/lib/types/robot";

export const fetchFleet = async (): Promise<SimulatedRobot[]> => {
  const result = await fetch("/api/robots");
  // Note: fetch only rejects on network failures, so HTTP errors have to be thrown manually for the query to fail
  if (!result.ok) {
    throw new Error(`Failed to load fleet (${result.status})`);
  }
  const parsedResponse = (await result.json()) as {
    fleet: SimulatedRobot[];
  };
  return parsedResponse.fleet;
};

export const useFleet = () => {
  const { data: fleet, isPending } = useQuery({
    queryKey: ["fleet"],
    initialData: [],
    queryFn: fetchFleet,
  });

  return {
    fleet,
    fleetRequestIsPending: isPending,
  };
};
