import type { ReactNode } from "react";
import { LOW_BATTERY_HINT_PERCENT } from "@/lib/client/config";
import type { RobotOverride } from "@/lib/types/robot";

type ControlButtonProps = {
  children: ReactNode;
  disabled: boolean;
  onClick: () => void;
};

const ControlButton = ({ children, disabled, onClick }: ControlButtonProps) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
};

type ControlRowProps = {
  label: string;
  children: ReactNode;
};

const ControlRow = ({ label, children }: ControlRowProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] text-zinc-500">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
};

type DeveloperControlsProps = {
  isReportingBroken: boolean;
  isPending: boolean;
  failed: boolean;
  onOverride: (override: RobotOverride) => void;
};

export const DeveloperControls = ({
  isReportingBroken,
  isPending,
  failed,
  onOverride,
}: DeveloperControlsProps) => {
  // Note: A robot that can not report can not receive changes either, so only restoring reporting stays available
  const controlsLocked = isPending || isReportingBroken;

  return (
    <div className="flex flex-col gap-4">
      <ControlRow label="Job">
        <ControlButton
          disabled={controlsLocked}
          onClick={() => onOverride({ operationalState: "working" })}
        >
          Work now
        </ControlButton>
        <ControlButton
          disabled={controlsLocked}
          onClick={() => onOverride({ operationalState: "idle" })}
        >
          Idle now
        </ControlButton>
      </ControlRow>
      <ControlRow label="Error">
        <ControlButton
          disabled={controlsLocked}
          onClick={() => onOverride({ operationalState: "error" })}
        >
          Cause error
        </ControlButton>
        <ControlButton
          disabled={controlsLocked}
          onClick={() => onOverride({ operationalState: "working" })}
        >
          Recover
        </ControlButton>
      </ControlRow>
      <ControlRow label="Battery">
        <ControlButton
          disabled={controlsLocked}
          onClick={() =>
            onOverride({ batteryPercent: LOW_BATTERY_HINT_PERCENT })
          }
        >
          Low battery warning ({LOW_BATTERY_HINT_PERCENT}%)
        </ControlButton>
        <ControlButton
          disabled={controlsLocked}
          onClick={() => onOverride({ batteryPercent: 100 })}
        >
          Full (100%)
        </ControlButton>
      </ControlRow>
      <ControlRow label="Reporting">
        <ControlButton
          disabled={isPending}
          onClick={() => onOverride({ isReportingBroken: !isReportingBroken })}
        >
          {isReportingBroken ? "Restore reporting" : "Break reporting"}
        </ControlButton>
      </ControlRow>
      <p className="text-[13px] text-zinc-500">
        {failed
          ? "Couldn't apply the change. Try again."
          : isReportingBroken
            ? "Reporting is broken. Restore it to send changes."
            : "Changes appear with the robot's next report."}
      </p>
    </div>
  );
};
