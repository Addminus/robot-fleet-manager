import type { OperationalStateCounts } from "@/lib/client/helpers/get-fleet-composition";
import type { OperationalState } from "@/lib/types/robot";

type FleetCompositionProps = {
  composition: OperationalStateCounts;
};

const states: { state: OperationalState; label: string; dot: string }[] = [
  { state: "working", label: "Working", dot: "bg-emerald-500" },
  { state: "idle", label: "Idle", dot: "bg-zinc-400" },
  { state: "charging", label: "Charging", dot: "bg-sky-500" },
  { state: "error", label: "Error", dot: "bg-red-700" },
];

export const FleetComposition = ({ composition }: FleetCompositionProps) => {
  return (
    <ul className="flex flex-wrap gap-8">
      {states.map(({ state, label, dot }) => (
        <li key={state} className="flex flex-col gap-1">
          <span className="text-2xl font-semibold leading-none tracking-tight tabular-nums">
            {composition[state]}
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
