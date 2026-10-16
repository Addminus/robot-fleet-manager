import {
  type VendorProfile,
  vendorProfiles,
} from "@/lib/server/vendor-profiles";
import type {
  RobotId,
  RobotTelemetry,
  SimulatedRobot,
} from "@/lib/types/robot";

export function createInitialFleet(
  now: number,
  profiles: VendorProfile[] = vendorProfiles,
): SimulatedRobot[] {
  const fleet = [];
  for (const vendor of profiles) {
    for (let index = 1; index <= vendor.robotCount; index += 1) {
      const robotNumber = String(index).padStart(2, "0");
      const id: RobotId = `${vendor.id}:${robotNumber}`;
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
          batteryPercent: 40 + Math.random() * 60,
          operationalState: pickRandomInitialState(),
        },
        batteryDrainPerSecond: 0.47 + Math.random() * 0.95,
      });
    }
  }

  return fleet;
}

function pickRandomInitialState(): RobotTelemetry["operationalState"] {
  const roll = Math.random();
  if (roll < 0.65) return "working";
  if (roll < 0.85) return "idle";
  if (roll < 0.97) return "charging";
  return "error";
}
