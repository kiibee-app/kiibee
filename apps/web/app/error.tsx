"use client";

import { useEffect } from "react";
import ErrorFallback from "@/components/common/ErrorFallback";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorFallback
      error={error}
      resetErrorBoundary={reset}
      title="Kiibee encountered an error"
    />
  );
}
