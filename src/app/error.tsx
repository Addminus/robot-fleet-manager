"use client";

import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useEffect } from "react";
import { Card } from "@/components/card";

type ErrorPageProps = {
  error: unknown;
  retry: () => void;
};

export default function ErrorPage({ error, retry }: ErrorPageProps) {
  const { reset } = useQueryErrorResetBoundary();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card title="Something went wrong">
      <p className="text-[13px] text-zinc-500">
        {error instanceof Error ? error.message : "Unexpected error"}
      </p>
      <button
        type="button"
        className="mt-4 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium hover:bg-zinc-50"
        onClick={() => {
          // Note: Clears the failed query first, otherwise TanStack Query rethrows the cached error on re-render
          reset();
          retry();
        }}
      >
        Try again
      </button>
    </Card>
  );
}
