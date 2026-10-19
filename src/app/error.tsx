"use client";

import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useEffect } from "react";
import { BackLink } from "@/components/back-link";
import { Card } from "@/components/card";
import { HttpError, isClientError } from "@/lib/client/http-error";

type ErrorPageProps = {
  error: unknown;
  retry: () => void;
};

export default function ErrorPage({ error, retry }: ErrorPageProps) {
  const { reset } = useQueryErrorResetBoundary();

  useEffect(() => {
    console.error(error);
  }, [error]);

  const isNotFound = error instanceof HttpError && error.status === 404;

  return (
    <Card title={isNotFound ? "Not found" : "Something went wrong"}>
      <p className="text-[13px] text-zinc-500">
        {isNotFound
          ? "There is nothing at this address. The robot may not exist."
          : error instanceof Error
            ? error.message
            : "Unexpected error"}
      </p>
      <div className="mt-4 flex items-center gap-4">
        {/* Note: A wrong request (4xx) fails the same way again, so only server and network errors offer a retry */}
        {!isClientError(error) && (
          <button
            type="button"
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium hover:bg-zinc-50"
            onClick={() => {
              // Note: Clears the failed query first, otherwise TanStack Query rethrows the cached error on re-render
              reset();
              retry();
            }}
          >
            Try again
          </button>
        )}
        <BackLink href="/" />
      </div>
    </Card>
  );
}
