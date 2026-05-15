"use client";

import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
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
    <ErrorBoundary
      fallbackRender={(fallbackProps) => (
        <ErrorFallback {...fallbackProps} title="Kiibee encountered an error" />
      )}
      onReset={reset}
    >
      <ErrorFallback
        error={error}
        resetErrorBoundary={reset}
        title="Kiibee encountered an error"
      />
    </ErrorBoundary>
  );
}
