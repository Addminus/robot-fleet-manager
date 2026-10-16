import { useQuery } from "@tanstack/react-query";
import type { Robot } from "@/lib/types/robot";

export const useFleet = () => {
  const { data: fleet, isPending } = useQuery({
    queryKey: ["fleet"],
    initialData: [],
    queryFn: async () => {
      const result = await fetch("/api/robots");
      const parsedResponse = (await result.json()) as { fleet: Robot[] };
      return parsedResponse.fleet;
    },
  });

  return {
    fleet,
    fleetRequestIsPending: isPending,
  };
};
