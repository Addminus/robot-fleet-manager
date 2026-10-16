"use client";

import { FleetView } from "@/components/fleet/fleet-view";
import { useFleet } from "@/lib/client/hooks/useFleet";

export const FleetContainer = () => {
  const { fleet } = useFleet();

  return <FleetView fleet={fleet} />;
};
