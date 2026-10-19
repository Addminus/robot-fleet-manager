"use client";

import { FleetLoading } from "@/components/fleet/fleet-loading";
import { FleetView } from "@/components/fleet/fleet-view";
import { getAttentionSummary } from "@/lib/client/helpers/get-attention-summary";
import { getFleetComposition } from "@/lib/client/helpers/get-fleet-composition";
import { getRobotsByLastSeen } from "@/lib/client/helpers/get-robots-by-last-seen";
import { getRobotsNeedingAttention } from "@/lib/client/helpers/get-robots-needing-attention";
import { useFleet } from "@/lib/client/hooks/use-fleet";

export const FleetContainer = () => {
  const { fleet, fleetUpdatedAt, fleetRequestIsPending, fleetRefreshFailed } =
    useFleet();

  if (fleetRequestIsPending) return <FleetLoading />;

  return (
    <FleetView
      fleet={fleet}
      now={fleetUpdatedAt}
      refreshFailed={fleetRefreshFailed}
      attentionSummary={getAttentionSummary(fleet, fleetUpdatedAt)}
      composition={getFleetComposition(fleet, fleetUpdatedAt)}
      robotsNeedingAttention={getRobotsNeedingAttention(fleet, fleetUpdatedAt)}
      robotsByLastSeen={getRobotsByLastSeen(fleet)}
    />
  );
};
