import Link from "next/link";
import type { RobotId } from "@/lib/types/robot";

type ErrorToastProps = {
  robotId?: RobotId;
  onDismiss: () => void;
};

// Note: Intentionally minimal. It is a non-modal live region, so it must not trap or steal focus.
// The <output> stays mounted and only its content changes, as screen readers announce changes, not new regions.
// A stacked or timed toast system would warrant a library such as Base UI's Toast.
export const ErrorToast = ({ robotId, onDismiss }: ErrorToastProps) => {
  return (
    <output className="fixed right-6 top-6 z-50">
      {robotId && (
        <div className="flex items-center gap-4 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm shadow-lg">
          <div className="flex flex-col">
            <span className="font-semibold text-red-700">Error reported</span>
            <span className="font-mono text-xs text-zinc-500">{robotId}</span>
          </div>
          <Link
            href={`/${robotId}`}
            onClick={onDismiss}
            className="font-medium text-zinc-900 underline underline-offset-2 hover:text-red-700"
          >
            View details
          </Link>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className="text-zinc-400 hover:text-zinc-900"
          >
            ×
          </button>
        </div>
      )}
    </output>
  );
};
