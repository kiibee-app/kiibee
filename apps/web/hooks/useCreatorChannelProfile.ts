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
import { displayCreatorName, getAvatarUrl } from "@/utils/creatorProfile";

export function useCreatorChannelProfile(enabled = true) {
  const searchParams = useSearchParams();
  const publicCreatorId = searchParams.get("creatorId");
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

  const profile = profileQuery.data?.data;

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

  return {
    displayName,
    avatarUrl,
    initial,
    isLoadingProfile: isPublicView ? isLoadingPublic : profileQuery.isLoading,
    isPublicView,
    publicCreatorId,
  };
}
