"use client";

import { FleetView } from "@/components/fleet/fleet-view";
import { getAttentionSummary } from "@/lib/client/helpers/get-attention-summary";
import { getFleetComposition } from "@/lib/client/helpers/get-fleet-composition";
import { getRobotsNeedingAttention } from "@/lib/client/helpers/get-robots-needing-attention";
import { useFleet } from "@/lib/client/hooks/useFleet";

export const FleetContainer = () => {
  const { fleet, fleetUpdatedAt } = useFleet();

  return (
    <FleetView
      fleet={fleet}
      now={fleetUpdatedAt}
      attentionSummary={getAttentionSummary(fleet, fleetUpdatedAt)}
      composition={getFleetComposition(fleet, fleetUpdatedAt)}
      robotsNeedingAttention={getRobotsNeedingAttention(fleet, fleetUpdatedAt)}
    />
  );
};
