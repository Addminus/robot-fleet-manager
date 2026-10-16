import Link from "next/link";
import type { AttentionReason } from "@/lib/client/helpers/get-attention-reason";
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

const formatSecondsAgo = (milliseconds: number) =>
  `${Math.max(0, Math.round(milliseconds / 1000))}s ago`;

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
          <th className="py-2 font-medium">Robot</th>
          <th className="py-2 font-medium">Reason</th>
          <th className="py-2 font-medium">Reported state</th>
          <th className="py-2 text-right font-medium">Battery</th>
          <th className="py-2 text-right font-medium">Last seen</th>
        </tr>
      </thead>
      <tbody>
        {robots.map(({ robot: { robot, telemetry }, reason }) => (
          // Note: The link's ::after overlay stretches over the whole row, since <a> can not wrap a <tr>
          <tr
            key={robot.id}
            className="relative border-b border-zinc-100 last:border-0 hover:bg-zinc-50"
          >
            <td className="py-2">
              <Link
                href={`/${robot.id}`}
                className="font-medium after:absolute after:inset-0 after:content-['']"
              >
                {robot.displayName}
              </Link>
            </td>
            <td className="py-2 font-medium text-red-700">
              {reasonLabels[reason]}
            </td>
            <td className="py-2 capitalize text-zinc-500">
              {telemetry.operationalState}
            </td>
            <td className="py-2 text-right tabular-nums">
              {Math.round(telemetry.batteryPercent)}%
            </td>
            <td className="py-2 text-right tabular-nums text-zinc-500">
              {formatSecondsAgo(now - telemetry.observedAt)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
