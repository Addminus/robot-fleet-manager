import type {
  RobotStatus,
  RobotStatusCounts,
} from "@/lib/client/helpers/get-fleet-composition";

type FleetCompositionProps = {
  composition: RobotStatusCounts;
};

const buckets: { bucket: RobotStatus; label: string; dot: string }[] = [
  { bucket: "working", label: "Working", dot: "bg-emerald-500" },
  { bucket: "idle", label: "Idle", dot: "bg-zinc-400" },
  { bucket: "charging", label: "Charging", dot: "bg-sky-500" },
  { bucket: "attention", label: "Needs attention", dot: "bg-red-700" },
];

export const FleetComposition = ({ composition }: FleetCompositionProps) => {
  return (
    <ul className="flex flex-wrap gap-8">
      {buckets.map(({ bucket, label, dot }) => (
        <li key={bucket} className="flex flex-col gap-1">
          <span className="text-2xl font-semibold leading-none tracking-tight tabular-nums">
            {composition[bucket]}
          </span>
          <span className="flex items-center gap-1.5 text-[13px] text-zinc-500">
            <span className={`size-2 rounded-full ${dot}`} />
            {label}
          </span>
        </li>
      ))}
    </ul>
  );
};
