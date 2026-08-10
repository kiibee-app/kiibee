"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { authStorage } from "@/lib/auth/authStorage";
import { pathLoginWithNext, isSafePostLoginPath } from "@/utils/path";
import { logger } from "@/lib/logger";

export function useProtectedContentNavigation() {
  const router = useRouter();

  const navigateToContent = useCallback(
    (href: string, requiresAuth = false) => {
      const isInternal =
        href.startsWith("/") &&
        !href.startsWith("//") &&
        !href.startsWith("/\\");

      if (!isInternal) {
        logger.warn("Blocked external navigation:", href);
        return;
      }

      if (!requiresAuth || authStorage.hasSession()) {
        router.push(href);
        return;
      }

      if (!isSafePostLoginPath(href)) {
        logger.warn("Blocked unsafe post-login redirect:", href);
        return;
      }

      router.push(pathLoginWithNext(href));
    },
    [router],
  );

  return { navigateToContent };
}
