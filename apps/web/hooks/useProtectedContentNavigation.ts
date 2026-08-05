"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { authStorage } from "@/lib/auth/authStorage";
import { pathLoginWithNext, isSafePostLoginPath, PATHS } from "@/utils/path";
import { logger } from "@/lib/logger";

export function useProtectedContentNavigation() {
  const router = useRouter();

  const navigateToContent = useCallback(
    (href: string, requiresAuth = false) => {
      const isInternal =
        href.startsWith(PATHS.HOME) &&
        !href.startsWith(`${PATHS.HOME}${PATHS.HOME}`);
      if (!isInternal || !isSafePostLoginPath(href)) {
        logger.warn("Blocked external redirect:", href);
        return;
      }

      if (!requiresAuth || authStorage.hasSession()) {
        router.push(href);
        return;
      }

      router.push(pathLoginWithNext(href));
    },
    [router],
  );

  return { navigateToContent };
}
