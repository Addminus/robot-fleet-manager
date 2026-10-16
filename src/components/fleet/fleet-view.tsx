import { Card } from "@/components/card";
import { AttentionSummary } from "@/components/fleet/attention-summary";
import { FleetComposition } from "@/components/fleet/fleet-composition";
import type { AttentionCounts } from "@/lib/client/helpers/get-attention-summary";
import type { OperationalStateCounts } from "@/lib/client/helpers/get-fleet-composition";
import type { SimulatedRobot } from "@/lib/types/robot";

type FleetViewProps = {
  fleet: SimulatedRobot[];
  attentionSummary: AttentionCounts;
  composition: OperationalStateCounts;
};

export const FleetView = ({
  fleet,
  attentionSummary,
  composition,
}: FleetViewProps) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2">
        <span className="flex-1">
          <Card title="Needs attention">
            <AttentionSummary summary={attentionSummary} />
          </Card>
        </span>
        <span className="flex-2">
          <Card title="Fleet composition" subtitle={`${fleet.length} robots`}>
            <FleetComposition composition={composition} />
          </Card>
        </span>
      </div>

      <div>
        <Card
          title="Needs attention"
          subtitle="State the system can not resolve on its own"
        >
          Table of robots in need of attention
        </Card>
      </div>

      <div>
        <Card title="All robots">Table of all Robots</Card>
      </div>
    </div>
  );
};
