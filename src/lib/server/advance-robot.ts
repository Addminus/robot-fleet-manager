import type { OperationalState, SimulatedRobot } from "@/lib/types/robot";

const CHARGE_PERCENT_PER_SECOND = 2.5;
const CHARGE_THRESHOLD_PERCENT = 20;
const CHARGE_TARGET_PERCENT = 95;
const ERROR_CHANCE_ON_WORK_START = 0.2;

// Note: Robots are caught up lazily whenever they are read. Each step is one vendor report, so a robot
// reports at its vendor's cadence no matter how often it is read, and no background timer is needed.
export function advanceRobot(
  simulated: SimulatedRobot,
  updateIntervalInMilliseconds: number,
  now: number,
): void {
  while (simulated.telemetry.observedAt + updateIntervalInMilliseconds <= now) {
    // Note: A flat robot has no power to report, so it stays as it was last seen
    if (simulated.telemetry.batteryPercent <= 0) return;
    reportOnce(simulated, updateIntervalInMilliseconds);
  }
}

function reportOnce(
  simulated: SimulatedRobot,
  updateIntervalInMilliseconds: number,
): void {
  const { telemetry } = simulated;
  telemetry.observedAt += updateIntervalInMilliseconds;
  const reportedAt = telemetry.observedAt;
  // Note: Battery changes scale with elapsed time, so vendors with different cadences drain at the same rate
  const elapsedSeconds = updateIntervalInMilliseconds / 1000;

  if (telemetry.operationalState === "working") {
    telemetry.batteryPercent -=
      simulated.batteryDrainPerSecond * elapsedSeconds;
  } else if (telemetry.operationalState === "charging") {
    telemetry.batteryPercent += CHARGE_PERCENT_PER_SECOND * elapsedSeconds;
  }
  telemetry.batteryPercent = Math.min(
    100,
    Math.max(0, telemetry.batteryPercent),
  );

  if (telemetry.operationalState === "charging") {
    if (telemetry.batteryPercent >= CHARGE_TARGET_PERCENT) {
      enterState(simulated, "working", reportedAt);
    }
    return;
  }
  if (telemetry.operationalState === "error") return;

  if (
    telemetry.operationalState === "working" &&
    telemetry.batteryPercent <= CHARGE_THRESHOLD_PERCENT
  ) {
    enterState(simulated, "charging", reportedAt);
    return;
  }

  if (simulated.stateEndsAt !== null && reportedAt >= simulated.stateEndsAt) {
    if (telemetry.operationalState === "working") {
      enterState(simulated, "idle", reportedAt);
    } else {
      const startsWithError = Math.random() < ERROR_CHANCE_ON_WORK_START;
      enterState(simulated, startsWithError ? "error" : "working", reportedAt);
    }
  }
}

// Note: Every state change goes through here so no path can forget to set the deadline
function enterState(
  simulated: SimulatedRobot,
  next: OperationalState,
  at: number,
): void {
  simulated.telemetry.operationalState = next;
  if (next === "working") {
    simulated.stateEndsAt = at + simulated.workDurationInMilliseconds;
  } else if (next === "idle") {
    simulated.stateEndsAt = at + simulated.idleDurationInMilliseconds;
  } else {
    simulated.stateEndsAt = null;
  }
}
