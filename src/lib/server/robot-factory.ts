import {
  type VendorProfile,
  vendorProfiles,
} from "@/lib/server/vendor-profiles";
import type {
  OperationalState,
  RobotId,
  SimulatedRobot,
} from "@/lib/types/robot";

const FLAT_CHANCE = 0.03;

export function createInitialFleet(
  now: number,
  profiles: VendorProfile[] = vendorProfiles,
): SimulatedRobot[] {
  const fleet = [];
  for (const vendor of profiles) {
    for (let index = 1; index <= vendor.robotCount; index += 1) {
      const robotNumber = String(index).padStart(2, "0");
      const id: RobotId = `${vendor.id}:${robotNumber}`;
      const operationalState = pickRandomInitialState();
      const workDurationInMilliseconds = randomBetween(60_000, 180_000);
      const idleDurationInMilliseconds = randomBetween(15_000, 60_000);
      fleet.push({
        robot: {
          id,
          displayName: `${vendor.displayName} ${robotNumber}`,
          vendorId: vendor.id,
        },

        telemetry: {
          robotId: id,
          observedAt:
            now -
            Math.floor(Math.random() * vendor.updateIntervalInMilliseconds),
          batteryPercent: pickInitialBattery(operationalState),
          operationalState,
        },
        batteryDrainPerSecond: randomBetween(0.5, 0.7),
        workDurationInMilliseconds,
        idleDurationInMilliseconds,
        isReportingBroken: false,
        // Note: Start partway through the current block so robots don't switch state in lockstep
        stateEndsAt:
          operationalState === "working"
            ? now + Math.random() * workDurationInMilliseconds
            : operationalState === "idle"
              ? now + Math.random() * idleDurationInMilliseconds
              : null,
      });
    }
  }

  return fleet;
}

function pickRandomInitialState(): OperationalState {
  const roll = Math.random();
  if (roll < 0.65) return "working";
  if (roll < 0.85) return "idle";
  if (roll < 0.97) return "charging";
  return "error";
}

function pickInitialBattery(operationalState: OperationalState): number {
  if (Math.random() < FLAT_CHANCE) return 0;
  if (operationalState === "charging") return randomBetween(5, 20);
  return randomBetween(40, 100);
}

function randomBetween(minimum: number, maximum: number): number {
  return minimum + Math.random() * (maximum - minimum);
}
