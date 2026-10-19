import type { OperationalState as OperationalStateType } from "@/lib/types/robot";

type OperationalStateProps = {
  state: OperationalStateType;
};

const stateColor: Record<OperationalStateType, string> = {
  working: "text-emerald-700",
  idle: "text-zinc-500",
  charging: "text-sky-700",
  error: "text-red-700",
};

export const OperationalState = ({ state }: OperationalStateProps) => {
  return (
    <span
      className={`text-2xl font-semibold capitalize leading-none tracking-tight ${stateColor[state]}`}
    >
      {state}
    </span>
  );
};
