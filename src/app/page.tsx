import type { Metadata } from "next";
import { FleetContainer } from "@/lib/client/containers/fleet-container";

export const metadata: Metadata = {
  title: "Fleet | Overview",
};

export default function FleetPage() {
  return <FleetContainer />;
}
