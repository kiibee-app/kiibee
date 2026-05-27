"use client";

import { useEffect, useMemo, useState } from "react";
import {
  mergeStoredLoginUser,
  readStoredLoginUser,
  type LoginUser,
} from "@/hooks/auth/useLogin";
import type { GetCreatorProfileResponse } from "@/hooks/auth/creatorProfileApi";
import { API } from "@/lib/http/api/endpoints";
import { useGetAPI } from "@/lib/http/api/getApi";
import { authStorage } from "@/lib/auth/authStorage";
import { STORED_LOGIN_USER_UPDATED } from "@/lib/auth/storageKeys";
import { ROLE_CREATOR, ROLE_VIEWER, toTrimmedString } from "@/utils/Constants";
import { getAvatarUrl } from "@/utils/creatorProfile";

type ViewerProfileResponseData = {
  avatarUrl?: string | null;
};

type GetViewerProfileResponse = {
  data?: ViewerProfileResponseData;
};

export function useStoredLoginUser() {
  const [user, setUser] = useState<LoginUser | null>(null);

  useEffect(() => {
    const sync = () => setUser(readStoredLoginUser());

    sync();
    window.addEventListener(STORED_LOGIN_USER_UPDATED, sync);
    return () => window.removeEventListener(STORED_LOGIN_USER_UPDATED, sync);
  }, []);

  return user;
}

export function useLoginUserAvatar() {
  const user = useStoredLoginUser();
  const role = user?.role ?? authStorage.getRole();
  const isCreator = role === ROLE_CREATOR;
  const isViewer = role === ROLE_VIEWER;

  const creatorProfileQuery = useGetAPI<GetCreatorProfileResponse>(
    API.auth.creatorProfile,
    undefined,
    {
      enabled: isCreator,
      retry: false,
      refetchOnWindowFocus: false,
    },
  );

  const viewerProfileQuery = useGetAPI<GetViewerProfileResponse>(
    API.auth.userProfile,
    undefined,
    {
      enabled: isViewer && !isCreator,
      retry: false,
      refetchOnWindowFocus: false,
    },
  );

  const avatarUrl = useMemo(() => {
    if (isCreator) {
      const fromApi = getAvatarUrl(
        creatorProfileQuery.data?.data?.user?.avatarUrl,
      );
      if (fromApi) return fromApi;
    }

    if (isViewer) {
      const fromApi = getAvatarUrl(viewerProfileQuery.data?.data?.avatarUrl);
      if (fromApi) return fromApi;
    }

    return getAvatarUrl(user?.avatarUrl as string | null | undefined);
  }, [
    creatorProfileQuery.data,
    isCreator,
    isViewer,
    user?.avatarUrl,
    viewerProfileQuery.data,
  ]);

  useEffect(() => {
    const fromApi = isCreator
      ? getAvatarUrl(creatorProfileQuery.data?.data?.user?.avatarUrl)
      : isViewer
        ? getAvatarUrl(viewerProfileQuery.data?.data?.avatarUrl)
        : null;

    if (fromApi) {
      mergeStoredLoginUser({ avatarUrl: fromApi });
    }
  }, [creatorProfileQuery.data, isCreator, isViewer, viewerProfileQuery.data]);

  return avatarUrl;
}

export function getNameInitials(name: string): string {
  const trimmed = toTrimmedString(name);
  if (!trimmed) return "?";

  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  const first = parts[0].charAt(0).toUpperCase();
  const last = parts[parts.length - 1].charAt(0).toUpperCase();
  return `${first} ${last}`;
}

export function getLoginUserInitial(user: LoginUser | null): string {
  const firstName = toTrimmedString(user?.firstName);
  const lastName = toTrimmedString(user?.lastName);
  if (firstName || lastName) {
    return getNameInitials([firstName, lastName].filter(Boolean).join(" "));
  }

  const fullName = toTrimmedString(user?.fullName);
  if (fullName) return getNameInitials(fullName);

  const email = toTrimmedString(user?.email);
  return email ? email.charAt(0).toUpperCase() : "?";
}

export function getLoginUserEmail(user: LoginUser | null): string {
  return toTrimmedString(user?.email);
}

export function getLoginUserDisplayName(user: LoginUser | null): string {
  const fullName = toTrimmedString(user?.fullName);
  if (fullName) return fullName;

  const firstName = toTrimmedString(user?.firstName);
  const lastName = toTrimmedString(user?.lastName);
  const combined = [firstName, lastName].filter(Boolean).join(" ");
  if (combined) return combined;

  return getLoginUserEmail(user);
}

export function getDisplayInitial(
  displayName: string,
  user: LoginUser | null,
): string {
  const trimmed = toTrimmedString(displayName);
  if (trimmed) return getNameInitials(trimmed);

  return getLoginUserInitial(user);
}
