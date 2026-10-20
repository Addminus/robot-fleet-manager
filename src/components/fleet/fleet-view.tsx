import { Card } from "@/components/card";
import { AttentionSummary } from "@/components/fleet/attention-summary";
import { AttentionTable } from "@/components/fleet/attention-table";
import { FleetComposition } from "@/components/fleet/fleet-composition";
import { FleetTable } from "@/components/fleet/fleet-table";
import type { AttentionCounts } from "@/lib/client/helpers/get-attention-summary";
import type { RobotStatusCounts } from "@/lib/client/helpers/get-fleet-composition";
import type { RobotNeedingAttention } from "@/lib/client/helpers/get-robots-needing-attention";
import type { RobotSnapshot } from "@/lib/types/robot";

type FleetViewProps = {
  fleet: RobotSnapshot[];
  now: number;
  refreshFailed: boolean;
  attentionSummary: AttentionCounts;
  composition: RobotStatusCounts;
  robotsNeedingAttention: RobotNeedingAttention[];
  robotsByLastSeen: RobotSnapshot[];
};

export const FleetView = ({
  fleet,
  now,
  refreshFailed,
  attentionSummary,
  composition,
  robotsNeedingAttention,
  robotsByLastSeen,
}: FleetViewProps) => {
  return (
    <div className="flex flex-col gap-5">
      {refreshFailed && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-[13px] text-amber-800">
          Couldn't refresh fleet data. Showing the last successful update.
        </p>
      )}
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
