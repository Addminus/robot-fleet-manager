"use client";

import { ErrorToast } from "@/components/error-toast";
import { useLiveFleetErrors } from "@/lib/client/hooks/use-live-fleet-errors";

export const FleetErrorToastContainer = () => {
  const { latestError, dismissLatestError } = useLiveFleetErrors();

  return (
    <ErrorToast robotId={latestError?.robotId} onDismiss={dismissLatestError} />
  );
};
