"use client";

import { useLayoutEffect } from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import type { ProfileLayoutVariant } from "@/components/Feature/ProfileLayout/config";
import { useCreatorPublicProfile } from "@/hooks/creators/useExploreCreators";
import { API } from "@/lib/http/api/endpoints";
import { useGetAPI } from "@/lib/http/api/getApi";
import type { ContentAppearanceResponse } from "@/types/contentAppearanceType";
import {
  CREATOR_ID_PARAM,
  isCreatorLayoutKey,
  layoutParamFromKey,
  readSavedCreatorLayout,
  writeSavedCreatorLayout,
} from "@/utils/creatorChannel";

export function usePublicCreatorLayoutRedirect(
  currentLayout: ProfileLayoutVariant,
): boolean {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const rawCreatorSlug = params?.creatorSlug;
  const creatorSlug = Array.isArray(rawCreatorSlug)
    ? rawCreatorSlug[0]
    : rawCreatorSlug;
  const publicCreatorIdentifier =
    searchParams.get("creatorId") ||
    searchParams.get(CREATOR_ID_PARAM) ||
    creatorSlug ||
    null;
  const { creator, isLoading: isLoadingPublic } = useCreatorPublicProfile(
    publicCreatorIdentifier,
  );

  const appearanceQuery = useGetAPI<ContentAppearanceResponse>(
    API.content.appearance,
    undefined,
    {
      enabled: !publicCreatorIdentifier,
      retry: false,
      refetchOnWindowFocus: false,
    },
  );

  const isPublicView = Boolean(publicCreatorIdentifier);
  const activeLayout = isPublicView
    ? creator?.layout
    : appearanceQuery.data?.data?.layout;
  const isLoading = isPublicView ? isLoadingPublic : appearanceQuery.isLoading;

  const isLayoutPending =
    isLoading ||
    Boolean(
      activeLayout &&
      isCreatorLayoutKey(activeLayout) &&
      layoutParamFromKey(activeLayout) !== currentLayout,
    );

  useLayoutEffect(() => {
    if (isLoading) return;

    if (
      isPublicView &&
      creator?.slug &&
      pathname === `/creator/${currentLayout}`
    ) {
      const queryParams = new URLSearchParams(searchParams.toString());
      queryParams.delete("creatorId");
      queryParams.delete(CREATOR_ID_PARAM);
      const query = queryParams.toString();
      router.replace(`/${creator.slug}${query ? `?${query}` : ""}`);
      return;
    }

    if (isLoading || !activeLayout) return;
    if (!isCreatorLayoutKey(activeLayout)) return;

    if (!isPublicView && readSavedCreatorLayout() !== activeLayout) {
      writeSavedCreatorLayout(activeLayout);
    }

    const expectedLayout = layoutParamFromKey(activeLayout);
    if (expectedLayout === currentLayout) return;

    const nextPath = pathname.replace(
      `/creator/${currentLayout}`,
      `/creator/${expectedLayout}`,
    );
    const query = searchParams.toString();

    router.replace(query ? `${nextPath}?${query}` : nextPath);
  }, [
    activeLayout,
    currentLayout,
    creator?.slug,
    isLoading,
    isPublicView,
    pathname,
    router,
    searchParams,
  ]);

  return isLayoutPending;
}
