"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ProfileLayoutVariant } from "@/components/Feature/ProfileLayout/config";
import { useCreatorPublicProfile } from "@/hooks/creators/useExploreCreators";
import { API } from "@/lib/http/api/endpoints";
import { useGetAPI } from "@/lib/http/api/getApi";
import type { ContentAppearanceResponse } from "@/types/contentAppearanceType";
import {
  CREATOR_ID_PARAM,
  isCreatorLayoutKey,
  layoutParamFromKey,
  writeSavedCreatorLayout,
} from "@/utils/creatorChannel";

export function usePublicCreatorLayoutRedirect(
  currentLayout: ProfileLayoutVariant,
): boolean {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const publicCreatorId = searchParams.get(CREATOR_ID_PARAM);
  const { creator, isLoading: isLoadingPublic } =
    useCreatorPublicProfile(publicCreatorId);

  const appearanceQuery = useGetAPI<ContentAppearanceResponse>(
    API.content.appearance,
    undefined,
    {
      enabled: !publicCreatorId,
      retry: false,
      refetchOnWindowFocus: false,
    },
  );

  const isPublicView = Boolean(publicCreatorId);
  const activeLayout = isPublicView
    ? creator?.layout
    : appearanceQuery.data?.data?.layout;
  const isLoading = isPublicView ? isLoadingPublic : appearanceQuery.isLoading;

  useEffect(() => {
    if (!isPublicView && activeLayout && isCreatorLayoutKey(activeLayout)) {
      writeSavedCreatorLayout(activeLayout);
    }
  }, [isPublicView, activeLayout]);

  const isLayoutPending =
    isLoading ||
    Boolean(
      activeLayout &&
      isCreatorLayoutKey(activeLayout) &&
      layoutParamFromKey(activeLayout) !== currentLayout,
    );

  useLayoutEffect(() => {
    if (isLoading || !activeLayout) return;
    if (!isCreatorLayoutKey(activeLayout)) return;

    const expectedLayout = layoutParamFromKey(activeLayout);
    if (expectedLayout === currentLayout) return;

    const nextPath = pathname.replace(
      `/creator/${currentLayout}`,
      `/creator/${expectedLayout}`,
    );
    const query = searchParams.toString();

    router.replace(query ? `${nextPath}?${query}` : nextPath);
  }, [activeLayout, currentLayout, isLoading, pathname, router, searchParams]);

  return isLayoutPending;
}
