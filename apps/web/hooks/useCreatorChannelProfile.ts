"use client";

import { useMemo } from "react";
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
import { toTrimmedString } from "@/utils/Constants";
import { displayCreatorName, getAvatarUrl } from "@/utils/creatorProfile";

export function useCreatorChannelProfile(enabled = true) {
  const storedUser = useStoredLoginUser();
  const profileQuery = useGetAPI<GetCreatorProfileResponse>(
    API.auth.creatorProfile,
    undefined,
    {
      enabled,
      retry: false,
      refetchOnWindowFocus: false,
    },
  );

  const profile = profileQuery.data?.data;

  const displayName = useMemo(() => {
    if (profile) {
      const fromProfile = displayCreatorName(mapCreatorProfileToForm(profile));
      if (fromProfile) return fromProfile;

      const fullName = toTrimmedString(profile.user?.fullName);
      if (fullName) return fullName;
    }

    return getLoginUserDisplayName(storedUser);
  }, [profile, storedUser]);

  const avatarUrl = useMemo(() => {
    const fromApi = getAvatarUrl(profile?.user?.avatarUrl);
    if (fromApi) return fromApi;

    return getAvatarUrl(
      typeof storedUser?.avatarUrl === "string" ? storedUser.avatarUrl : null,
    );
  }, [profile, storedUser]);

  const initial = useMemo(
    () => getDisplayInitial(displayName, storedUser),
    [displayName, storedUser],
  );

  return {
    displayName,
    avatarUrl,
    initial,
    isLoadingProfile: profileQuery.isLoading,
  };
}
