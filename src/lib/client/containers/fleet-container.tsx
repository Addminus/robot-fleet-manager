"use client";

import { FleetView } from "@/components/fleet/fleet-view";
import { getAttentionSummary } from "@/lib/client/helpers/get-attention-summary";
import { useFleet } from "@/lib/client/hooks/useFleet";

export const FleetContainer = () => {
  const { fleet, fleetUpdatedAt } = useFleet();

  return (
    <FleetView
      fleet={fleet}
      attentionSummary={getAttentionSummary(fleet, fleetUpdatedAt)}
    />
  );
};
