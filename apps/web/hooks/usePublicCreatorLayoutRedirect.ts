"use client";

import { useLayoutEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ProfileLayoutVariant } from "@/components/Feature/ProfileLayout/config";
import { useCreatorPublicProfile } from "@/hooks/creators/useExploreCreators";
import {
  CREATOR_ID_PARAM,
  isCreatorLayoutKey,
  layoutParamFromKey,
} from "@/utils/creatorChannel";

export function usePublicCreatorLayoutRedirect(
  currentLayout: ProfileLayoutVariant,
): boolean {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const publicCreatorId = searchParams.get(CREATOR_ID_PARAM);
  const { creator, isLoading } = useCreatorPublicProfile(publicCreatorId);
  const creatorLayout = creator?.layout;

  const isLayoutPending =
    Boolean(publicCreatorId) &&
    (isLoading ||
      Boolean(
        creatorLayout &&
        isCreatorLayoutKey(creatorLayout) &&
        layoutParamFromKey(creatorLayout) !== currentLayout,
      ));

  useLayoutEffect(() => {
    if (!publicCreatorId || isLoading || !creatorLayout) return;
    if (!isCreatorLayoutKey(creatorLayout)) return;

    const expectedLayout = layoutParamFromKey(creatorLayout);
    if (expectedLayout === currentLayout) return;

    const nextPath = pathname.replace(
      `/creator/${currentLayout}`,
      `/creator/${expectedLayout}`,
    );
    const query = searchParams.toString();

    router.replace(query ? `${nextPath}?${query}` : nextPath);
  }, [
    creatorLayout,
    currentLayout,
    isLoading,
    pathname,
    publicCreatorId,
    router,
    searchParams,
  ]);

  return isLayoutPending;
}
