"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { isClientError } from "@/lib/client/http-error";

// Note: The client lives in state so each browser session gets its own cache and server renders never share one
export const Providers = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Note: Retry server and network failures as usual (3 times), but never a request that can not succeed
            retry: (failureCount, error) =>
              !isClientError(error) && failureCount < 3,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
