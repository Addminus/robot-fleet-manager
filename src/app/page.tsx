import type { Metadata } from "next";
import { FleetContainer } from "@/lib/client/containers/fleet-container";
import { APP_NAME } from "@/lib/client/config";

export const metadata: Metadata = {
  title: `${APP_NAME} | Overview`,
};

export default function FleetPage() {
  return <FleetContainer />;
}
