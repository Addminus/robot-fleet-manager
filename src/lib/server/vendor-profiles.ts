import type { Vendor } from "@/lib/types/vendor";

export type VendorProfile = Vendor & { robotCount: number };

export const vendorProfiles: VendorProfile[] = [
  {
    id: "robotics-international",
    displayName: "Robotics International",
    updateIntervalInMilliseconds: 1000,
    robotCount: 10,
  },
  {
    id: "cryotec",
    displayName: "Cryotec",
    updateIntervalInMilliseconds: 2000,
    robotCount: 5,
  },
];

export const vendorProfilesById = new Map(
  vendorProfiles.map((vendor) => [vendor.id, vendor]),
);
