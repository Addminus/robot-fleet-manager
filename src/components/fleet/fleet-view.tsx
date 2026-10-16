import { Card } from "@/components/card";
import { AttentionSummary } from "@/components/fleet/attention-summary";
import { AttentionTable } from "@/components/fleet/attention-table";
import { FleetComposition } from "@/components/fleet/fleet-composition";
import { FleetTable } from "@/components/fleet/fleet-table";
import type { AttentionCounts } from "@/lib/client/helpers/get-attention-summary";
import type { RobotStatusCounts } from "@/lib/client/helpers/get-fleet-composition";
import type { RobotNeedingAttention } from "@/lib/client/helpers/get-robots-needing-attention";
import type { SimulatedRobot } from "@/lib/types/robot";

type FleetViewProps = {
  fleet: SimulatedRobot[];
  now: number;
  attentionSummary: AttentionCounts;
  composition: RobotStatusCounts;
  robotsNeedingAttention: RobotNeedingAttention[];
  robotsByLastSeen: SimulatedRobot[];
};

export const FleetView = ({
  fleet,
  now,
  attentionSummary,
  composition,
  robotsNeedingAttention,
  robotsByLastSeen,
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
          <AttentionTable robots={robotsNeedingAttention} now={now} />
        </Card>
      </div>

      <div>
        <Card title="All robots">
          <FleetTable robots={robotsByLastSeen} now={now} />
        </Card>
      </div>
    </div>
  );
};
