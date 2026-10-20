import Link from "next/link";
import { formatLastSeen } from "@/lib/client/format-last-seen";
import type { RobotSnapshot } from "@/lib/types/robot";

type FleetTableProps = {
  robots: RobotSnapshot[];
  now: number;
};

export const FleetTable = ({ robots, now }: FleetTableProps) => {
  if (robots.length === 0) {
    return <p className="text-[13px] text-zinc-500">No robots in the fleet.</p>;
  }

  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b border-zinc-200 text-[13px] text-zinc-500">
        <tr>
          <th className="py-2 font-medium">Last reported state</th>
          <th className="py-2 font-medium">Robot</th>
          <th className="py-2 text-right font-medium">Battery</th>
          <th className="py-2 text-right font-medium">Last seen</th>
        </tr>
      </thead>
      <tbody>
        {robots.map((robot) => (
          // Note: The link's ::after overlay stretches over the whole row, since <a> can not wrap a <tr>
          <tr
            key={robot.id}
            className="relative border-b border-zinc-100 last:border-0 hover:bg-zinc-50"
          >
            <td className="py-2 capitalize text-zinc-500">
              {robot.latestTelemetry.operationalState}
            </td>
            <td className="py-2">
              <Link
                href={`/${robot.id}`}
                className="font-medium after:absolute after:inset-0 after:content-['']"
              >
                {robot.displayName}
              </Link>
            </td>
            <td className="py-2 text-right tabular-nums">
              {Math.round(robot.latestTelemetry.batteryPercent)}%
            </td>
            <td className="py-2 text-right font-mono text-xs text-zinc-500">
              {formatLastSeen(now - robot.latestTelemetry.observedAt)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
