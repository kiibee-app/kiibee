"use client";

import { useEffect } from "react";
import ErrorFallback from "@/components/common/ErrorFallback";
import { logger } from "@/lib/logger";
import type { ErrorProps } from "@/types/error";

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    logger.error(error);
  }, [error]);

  return (
    <ErrorFallback
      error={error}
      resetErrorBoundary={reset}
      title="Kiibee encountered an error"
    />
  );
}
