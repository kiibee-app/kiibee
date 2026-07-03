"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  mapCreatorProfileToForm,
  type GetCreatorProfileResponse,
} from "@/hooks/auth/creatorProfileApi";
import {
  getDisplayFirstLetter,
  getLoginUserDisplayName,
  useStoredLoginUser,
} from "@/hooks/auth/useStoredLoginUser";
import { API } from "@/lib/http/api/endpoints";
import { useGetAPI } from "@/lib/http/api/getApi";
import { useCreatorPublicProfile } from "@/hooks/creators/useExploreCreators";
import { toTrimmedString } from "@/utils/Constants";
import { formatJoinedDate } from "@/utils/formatDate";
import {
  displayCreatorName,
  getAvatarUrl,
  isCreatorWebsiteLink,
  resolveCreatorContactEmail,
} from "@/utils/creatorProfile";
import {
  type CollectionsApiResponse,
  getCollectionRows,
} from "@/hooks/contents/collectionApi";
import { CREATOR_ID_PARAM } from "@/utils/creatorChannel";
import type { ContentAppearanceResponse } from "@/types/contentAppearanceType";

export function useCreatorChannelProfile(enabled = true) {
  const searchParams = useSearchParams();
  const publicCreatorId = searchParams.get(CREATOR_ID_PARAM);
  const storedUser = useStoredLoginUser();
  const isOwnerOfPublicView =
    Boolean(publicCreatorId) && storedUser?.id === publicCreatorId;
  const isPublicView = Boolean(publicCreatorId) && !isOwnerOfPublicView;
  const { creator: publicCreator, isLoading: isLoadingPublic } =
    useCreatorPublicProfile(publicCreatorId);

  const profileQuery = useGetAPI<GetCreatorProfileResponse>(
    API.auth.creatorProfile,
    undefined,
    {
      enabled: enabled && !isPublicView,
      retry: false,
      refetchOnWindowFocus: false,
    },
  );

  const appearanceQuery = useGetAPI<ContentAppearanceResponse>(
    API.content.appearance,
    undefined,
    {
      enabled: enabled && (!isPublicView || isOwnerOfPublicView),
      retry: false,
      refetchOnWindowFocus: false,
    },
  );

  const { data: collectionsResponse } = useGetAPI<CollectionsApiResponse>(
    API.collection.getAll,
    undefined,
    {
      enabled: enabled && !isPublicView,
      retry: false,
      refetchOnWindowFocus: false,
    },
  );

  const profile = profileQuery.data?.data;

  const uploadCountPrivate = useMemo(() => {
    if (!collectionsResponse) return 0;
    const rows = getCollectionRows(collectionsResponse);
    return rows.reduce((sum, row) => sum + row.contentsCount, 0);
  }, [collectionsResponse]);

  const displayName = useMemo(() => {
    if (publicCreator?.name) {
      return publicCreator.name;
    }

    if (profile) {
      const fromProfile = displayCreatorName(mapCreatorProfileToForm(profile));
      if (fromProfile) return fromProfile;

      const fullName = toTrimmedString(profile.user?.fullName);
      if (fullName) return fullName;
    }

    return getLoginUserDisplayName(storedUser);
  }, [publicCreator, profile, storedUser]);

  const avatarUrl = useMemo(() => {
    const publicAvatar = getAvatarUrl(
      publicCreator?.profileImageUrl ?? publicCreator?.coverImageUrl,
    );
    if (publicAvatar) return publicAvatar;

    const fromApi = getAvatarUrl(profile?.user?.avatarUrl);
    if (fromApi) return fromApi;

    return getAvatarUrl(storedUser?.avatarUrl);
  }, [publicCreator, profile, storedUser]);

  const coverImageUrl = useMemo(() => {
    if (isPublicView) {
      return getAvatarUrl(publicCreator?.coverImageUrl);
    }
    return getAvatarUrl(appearanceQuery.data?.data?.desktopCoverImageUrl);
  }, [isPublicView, publicCreator, appearanceQuery.data]);

  const initial = useMemo(
    () => getDisplayFirstLetter(displayName, storedUser),
    [displayName, storedUser],
  );

  const aboutData = useMemo(() => {
    if (isPublicView) {
      if (!publicCreator) return null;
      const hasAppearance = isOwnerOfPublicView && appearanceQuery.data?.data;
      const customDesc = hasAppearance
        ? (appearanceQuery.data?.data?.description ?? "")
        : undefined;
      const supportEmail = hasAppearance
        ? appearanceQuery.data?.data?.supportEmail
        : publicCreator.supportEmail;
      return {
        description:
          customDesc !== undefined
            ? customDesc
            : (publicCreator.contentDescription ?? ""),
        joinedDate: formatJoinedDate(publicCreator.createdAt),
        uploadCount: publicCreator.uploadCount ?? 0,
        websiteLink: isCreatorWebsiteLink(publicCreator.exampleWorkLink ?? "")
          ? (publicCreator.exampleWorkLink ?? "")
          : "",
        contactEmail: resolveCreatorContactEmail(
          supportEmail,
          publicCreator.accountEmail,
        ),
      };
    }

    if (!profile) return null;
    return {
      description: appearanceQuery.data?.data
        ? (appearanceQuery.data.data.description ?? "")
        : (profile.creatorInfo?.contentDescription ?? ""),
      joinedDate: formatJoinedDate(profile.user?.createdAt),
      uploadCount: uploadCountPrivate,
      websiteLink: isCreatorWebsiteLink(
        profile.creatorInfo?.exampleWorkLink ?? "",
      )
        ? (profile.creatorInfo?.exampleWorkLink ?? "")
        : "",
      contactEmail: resolveCreatorContactEmail(
        appearanceQuery.data?.data?.supportEmail,
        profile.user?.email,
      ),
    };
  }, [
    isPublicView,
    publicCreator,
    profile,
    uploadCountPrivate,
    appearanceQuery.data,
    isOwnerOfPublicView,
  ]);

  return {
    displayName,
    avatarUrl,
    coverImageUrl,
    initial,
    isLoadingProfile: isPublicView
      ? isLoadingPublic
      : profileQuery.isLoading || appearanceQuery.isLoading,
    isPublicView,
    publicCreatorId,
    about: aboutData,
  };
}
