import Link from "next/link";
import { formatLastSeen } from "@/lib/client/format-last-seen";
import type { AttentionReason } from "@/lib/client/helpers/get-robot-health";
import type { RobotNeedingAttention } from "@/lib/client/helpers/get-robots-needing-attention";

type AttentionTableProps = {
  robots: RobotNeedingAttention[];
  now: number;
};

const reasonLabels: Record<AttentionReason, string> = {
  error: "Error",
  flat: "Battery empty",
  lost: "Connection lost",
};

export const AttentionTable = ({ robots, now }: AttentionTableProps) => {
  if (robots.length === 0) {
    return (
      <p className="text-[13px] text-zinc-500">No robots need attention.</p>
    );
  }

  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b border-zinc-200 text-[13px] text-zinc-500">
        <tr>
          <th className="py-2 font-medium">Reason</th>
          <th className="py-2 font-medium">Robot</th>
          <th className="py-2 font-medium">Last reported state</th>
          <th className="py-2 text-right font-medium">Battery</th>
          <th className="py-2 text-right font-medium">Last seen</th>
        </tr>
      </thead>
      <tbody>
        {robots.map(
          ({ robot: { robot, latestTelemetry: telemetry }, reason }) => (
            // Note: The link's ::after overlay stretches over the whole row, since <a> can not wrap a <tr>
            <tr
              key={robot.id}
              className="relative border-b border-zinc-100 last:border-0 hover:bg-zinc-50"
            >
              <td className="py-2 font-medium text-red-700">
                {reasonLabels[reason]}
              </td>
              <td className="py-2">
                <Link
                  href={`/${robot.id}`}
                  className="font-medium after:absolute after:inset-0 after:content-['']"
                >
                  {robot.displayName}
                </Link>
              </td>
              <td className="py-2 capitalize text-zinc-500">
                {telemetry.operationalState}
              </td>
              <td className="py-2 text-right tabular-nums">
                {Math.round(telemetry.batteryPercent)}%
              </td>
              <td className="py-2 text-right font-mono text-xs text-zinc-500">
                {formatLastSeen(now - telemetry.observedAt)}
              </td>
            </tr>
          ),
        )}
      </tbody>
    </table>
  );
};
