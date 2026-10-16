import type { AttentionCounts as AttentionSummaryData } from "@/lib/client/helpers/get-attention-summary";

type AttentionSummaryProps = {
  summary: AttentionSummaryData;
};

export const AttentionSummary = ({ summary }: AttentionSummaryProps) => {
  return (
    <div>
      <span className="text-4xl font-semibold leading-none tracking-tight text-red-700 tabular-nums">
        {summary.total}
      </span>
      <p className="mt-4 text-[13px] text-zinc-500">
        {summary.error} error · {summary.flat} flat · {summary.lost} lost
      </p>
    </div>
  );
};
