"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { authStorage } from "@/lib/auth/authStorage";
import { pathLoginWithNext } from "@/utils/path";

export function useProtectedContentNavigation() {
  const router = useRouter();

  const navigateToContent = useCallback(
    (href: string, requiresAuth = false) => {
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
