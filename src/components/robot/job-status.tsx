import type {
  JobChipState,
  JobStatus as JobStatusType,
} from "@/lib/client/helpers/get-job-status";

const chipStyles: Record<JobChipState, string> = {
  active: "border-emerald-300 bg-emerald-50 text-emerald-700",
  paused: "border-dashed border-sky-300 bg-sky-50 text-sky-700",
  inactive: "border-zinc-200 bg-white text-zinc-500",
  disabled: "border-zinc-200 bg-zinc-50 text-zinc-400",
};

const chipSuffix: Partial<Record<JobChipState, string>> = {
  paused: " · paused",
};

type JobChipProps = {
  label: string;
  state: JobChipState;
};

const JobChip = ({ label, state }: JobChipProps) => {
  return (
    <span
      className={`rounded-full border-2 px-6 py-2.5 text-lg font-semibold ${chipStyles[state]}`}
    >
      {label}
      {chipSuffix[state]}
    </span>
  );
};

type JobStatusProps = {
  status: JobStatusType;
};

export const JobStatus = ({ status }: JobStatusProps) => {
  return (
    <div className="flex flex-col items-center gap-5 py-10">
      <div className="flex items-center gap-4">
        <JobChip label="Working" state={status.working} />
        <span aria-hidden="true" className="text-2xl text-zinc-300">
          ⇄
        </span>
        <JobChip label="Idle" state={status.idle} />
      </div>
      {status.message && (
        <p className="text-center text-base text-zinc-600">{status.message}</p>
      )}
    </div>
  );
};
