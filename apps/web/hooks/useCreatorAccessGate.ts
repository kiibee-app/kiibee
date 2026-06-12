"use client";

import { useSearchParams } from "next/navigation";
import type { AccessGateType } from "@/components/Feature/AccessGate";

import {
  GATE_QUERY_PARAM,
  TYPE_CODE,
  TYPE_EMAIL,
  SET_PASSWORD_ACCESS,
  REQUEST_EMAIL_ACCESS,
  ACCESS_TYPE_PASSWORD,
  ACCESS_TYPE_EMAIL_GATED,
} from "@/utils/Constants";
import { useContentSettings } from "@/hooks/contents/useContentSettings";
import { useCreatorChannelProfile } from "@/hooks/useCreatorChannelProfile";
import { useCreatorPublicProfile } from "@/hooks/creators/useExploreCreators";

import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import { readStoredLoginUser } from "@/hooks/auth/useLogin";

export function useCreatorAccessGate(customCreatorId?: string | null): {
  gateType: AccessGateType | null;
  isLoading: boolean;
} {
  const searchParams = useSearchParams();
  const gateParam = searchParams.get(GATE_QUERY_PARAM);

  const { isPublicView: profileIsPublic, publicCreatorId: profileCreatorId } =
    useCreatorChannelProfile();
  const storedUser =
    useStoredLoginUser() ??
    (typeof window !== "undefined" ? readStoredLoginUser() : null);

  const publicCreatorId =
    customCreatorId !== undefined ? customCreatorId : profileCreatorId;
  const isPublicView =
    customCreatorId !== undefined ? Boolean(customCreatorId) : profileIsPublic;

  const { creator: publicCreator, isLoading: isLoadingPublic } =
    useCreatorPublicProfile(isPublicView ? publicCreatorId : null);

  const { data: privateSettings, isLoading: isLoadingPrivate } =
    useContentSettings();

  const storageKey = publicCreatorId
    ? `kiibee:gate:unlocked:creator:${publicCreatorId}`
    : "";
  const isUnlocked =
    typeof window !== "undefined" && storageKey
      ? window.localStorage.getItem(storageKey) === "true"
      : false;

  const isOwner =
    !isPublicView ||
    (Boolean(publicCreatorId) &&
      storedUser &&
      storedUser.id === publicCreatorId);

  if (isUnlocked) {
    return { gateType: null, isLoading: false };
  }

  if (isOwner) {
    return { gateType: null, isLoading: false };
  }

  if (gateParam === TYPE_CODE || gateParam === TYPE_EMAIL) {
    return { gateType: gateParam, isLoading: false };
  }

  const isLoading = isPublicView ? isLoadingPublic : isLoadingPrivate;

  if (isLoading) {
    return { gateType: null, isLoading: true };
  }

  const accessType = isPublicView
    ? publicCreator?.accessType
    : privateSettings?.data?.accessType;

  let gateType: AccessGateType | null = null;
  if (
    accessType === SET_PASSWORD_ACCESS ||
    accessType === ACCESS_TYPE_PASSWORD
  ) {
    gateType = TYPE_CODE;
  } else if (
    accessType === REQUEST_EMAIL_ACCESS ||
    accessType === ACCESS_TYPE_EMAIL_GATED
  ) {
    gateType = TYPE_EMAIL;
  }

  return { gateType, isLoading: false };
}
