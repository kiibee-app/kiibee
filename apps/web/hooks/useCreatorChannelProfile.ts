"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  mapCreatorProfileToForm,
  type GetCreatorProfileResponse,
} from "@/hooks/auth/creatorProfileApi";
import {
  getDisplayInitial,
  getLoginUserDisplayName,
  useStoredLoginUser,
} from "@/hooks/auth/useStoredLoginUser";
import { API } from "@/lib/http/api/endpoints";
import { useGetAPI } from "@/lib/http/api/getApi";
import { useCreatorPublicProfile } from "@/hooks/creators/useExploreCreators";
import { toTrimmedString } from "@/utils/Constants";
import { formatJoinedDate } from "@/utils/formatDate";
import { displayCreatorName, getAvatarUrl } from "@/utils/creatorProfile";
import {
  type CollectionsApiResponse,
  getCollectionRows,
} from "@/hooks/contents/collectionApi";
import { CREATOR_ID_PARAM } from "@/utils/creatorChannel";

export function useCreatorChannelProfile(enabled = true) {
  const searchParams = useSearchParams();
  const publicCreatorId = searchParams.get(CREATOR_ID_PARAM);
  const isPublicView = Boolean(publicCreatorId);

  const storedUser = useStoredLoginUser();
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

  const initial = useMemo(
    () => getDisplayInitial(displayName, storedUser),
    [displayName, storedUser],
  );

  const aboutData = useMemo(() => {
    if (isPublicView) {
      if (!publicCreator) return null;
      return {
        description: publicCreator.contentDescription ?? "",
        joinedDate: formatJoinedDate(publicCreator.createdAt),
        uploadCount: publicCreator.uploadCount ?? 0,
        websiteLink: publicCreator.exampleWorkLink ?? "",
      };
    }

    if (!profile) return null;
    return {
      description: profile.creatorInfo?.contentDescription ?? "",
      joinedDate: formatJoinedDate(profile.user?.createdAt),
      uploadCount: uploadCountPrivate,
      websiteLink: profile.creatorInfo?.exampleWorkLink ?? "",
    };
  }, [isPublicView, publicCreator, profile, uploadCountPrivate]);

  return {
    displayName,
    avatarUrl,
    initial,
    isLoadingProfile: isPublicView ? isLoadingPublic : profileQuery.isLoading,
    isPublicView,
    publicCreatorId,
    about: aboutData,
  };
}
