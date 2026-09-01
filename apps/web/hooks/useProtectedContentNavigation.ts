"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { logger } from "@/lib/logger";

export function useProtectedContentNavigation() {
  const router = useRouter();

  const navigateToContent = useCallback(
    (href: string) => {
      const isInternal =
        href.startsWith("/") &&
        !href.startsWith("//") &&
        !href.startsWith("/\\");

      if (!isInternal) {
        logger.warn("Blocked external navigation:", href);
        return;
      }

      router.push(href);
    },
    [router],
  );

  return { navigateToContent };
}
