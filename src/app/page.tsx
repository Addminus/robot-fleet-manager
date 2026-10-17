import type { Metadata } from "next";
import { APP_NAME } from "@/lib/client/config";
import { FleetContainer } from "@/lib/client/containers/fleet-container";

export const metadata: Metadata = {
  title: `${APP_NAME} | Overview`,
};

export default function FleetPage() {
  return <FleetContainer />;
}
