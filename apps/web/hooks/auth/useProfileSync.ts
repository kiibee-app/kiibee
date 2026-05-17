"use client";

import { useEffect } from "react";
import { mergeStoredLoginUser } from "@/hooks/auth/useLogin";
import {
  mapCreatorProfileToForm,
  type GetCreatorProfileResponse,
} from "@/hooks/auth/creatorProfileApi";
import { API } from "@/lib/http/api/endpoints";
import { useGetAPI } from "@/lib/http/api/getApi";
import {
  displayCreatorName,
  getAvatarUrl,
  toOptionalString,
} from "@/utils/creatorProfile";

export function useProfileSync() {
  const profileQuery = useGetAPI<GetCreatorProfileResponse>(
    API.auth.creatorProfile,
    undefined,
    {
      retry: false,
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    const profile = profileQuery.data?.data;
    if (!profile) return;

    const form = mapCreatorProfileToForm(profile);

    mergeStoredLoginUser({
      email: toOptionalString(form.email),
      fullName: toOptionalString(displayCreatorName(form)),
      firstName: toOptionalString(form.firstName),
      lastName: toOptionalString(form.lastName),
      avatarUrl: getAvatarUrl(profile.user?.avatarUrl),
    });
  }, [profileQuery.data]);

  return profileQuery;
}
