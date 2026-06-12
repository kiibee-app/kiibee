"use client";

import { useSearchParams } from "next/navigation";
import type { AccessGateType } from "@/components/Feature/AccessGate";

import {
  GATE_QUERY_PARAM,
  TYPE_CODE,
  TYPE_EMAIL,
  SET_PASSWORD_ACCESS,
  REQUEST_EMAIL_ACCESS,
} from "@/utils/Constants";
import { useContentSettings } from "@/hooks/contents/useContentSettings";
import { useCreatorChannelProfile } from "@/hooks/useCreatorChannelProfile";
import { useCreatorPublicProfile } from "@/hooks/creators/useExploreCreators";

import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";

export function useCreatorAccessGate(): {
  gateType: AccessGateType | null;
  isLoading: boolean;
} {
  const searchParams = useSearchParams();
  const gateParam = searchParams.get(GATE_QUERY_PARAM);

  const { isPublicView, publicCreatorId } = useCreatorChannelProfile();
  const storedUser = useStoredLoginUser();

  const { creator: publicCreator, isLoading: isLoadingPublic } =
    useCreatorPublicProfile(isPublicView ? publicCreatorId : null);

  const { data: privateSettings, isLoading: isLoadingPrivate } =
    useContentSettings();

  if (gateParam === TYPE_CODE || gateParam === TYPE_EMAIL) {
    return { gateType: gateParam, isLoading: false };
  }

  const isOwner =
    !isPublicView ||
    (Boolean(publicCreatorId) &&
      storedUser &&
      storedUser.id === publicCreatorId);

  if (isOwner) {
    return { gateType: null, isLoading: false };
  }

  const isLoading = isPublicView ? isLoadingPublic : isLoadingPrivate;

  if (isLoading) {
    return { gateType: null, isLoading: true };
  }

  const accessType =
    (isPublicView ? publicCreator?.accessType : undefined) ||
    privateSettings?.data?.accessType;

  let gateType: AccessGateType | null = null;
  if (accessType === SET_PASSWORD_ACCESS) {
    gateType = TYPE_CODE;
  } else if (accessType === REQUEST_EMAIL_ACCESS) {
    gateType = TYPE_EMAIL;
  }

  return { gateType, isLoading: false };
}
