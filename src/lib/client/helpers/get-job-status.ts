import {
  type AttentionReason,
  getRobotHealth,
} from "@/lib/client/helpers/get-robot-health";
import type { RobotTelemetry } from "@/lib/types/robot";

// Note: The simulation starts charging at 20 %, so a little above that is when a charge becomes imminent
export const LOW_BATTERY_HINT_PERCENT = 30;

export type JobChipState = "active" | "paused" | "inactive" | "disabled";

export type JobStatus = {
  working: JobChipState;
  idle: JobChipState;
  message?: string;
};

const attentionMessages: Record<AttentionReason, string> = {
  error: "Current task aborted due to error.",
  flat: "Current task aborted, battery flat.",
  lost: "No reports, current task unknown.",
};

// Note: Robots alternate between working and idle. Charging and errors interrupt that cycle, so they change how the two jobs read
export function getJobStatus(
  telemetry: RobotTelemetry,
  now: number,
): JobStatus {
  const health = getRobotHealth(telemetry, now);
  if (health.status === "needs-attention") {
    return {
      working: "disabled",
      idle: "disabled",
      message: attentionMessages[health.reason],
    };
  }
  if (health.state === "charging") {
    // Note: Charging only ever interrupts a work block, so working is the job that is paused
    return {
      working: "paused",
      idle: "inactive",
      message: "Current job paused, charging battery.",
    };
  }
  if (health.state === "working") {
    return {
      working: "active",
      idle: "inactive",
      message:
        telemetry.batteryPercent < LOW_BATTERY_HINT_PERCENT
          ? "Battery low, charging soon."
          : undefined,
    };
  }
  return { working: "inactive", idle: "active" };
}
