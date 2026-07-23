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
  REGISTER_SOURCE,
} from "@/utils/Constants";
import { useContentSettings } from "@/hooks/contents/useContentSettings";
import { useCreatorChannelProfile } from "@/hooks/useCreatorChannelProfile";
import { useCreatorPublicProfile } from "@/hooks/creators/useExploreCreators";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import { API } from "@/lib/http/api/endpoints";
import { axiosClient } from "@/lib/http/axiosClient";
import {
  getCreatorUnlockStorageKey,
  unlockCreatorAccessGate,
} from "@/utils/accessGate";

export function useCreatorAccessGate(customCreatorId?: string | null): {
  gateType: AccessGateType | null;
  isLoading: boolean;
  handleSuccess: (value: string, name?: string) => Promise<boolean>;
} {
  const searchParams = useSearchParams();
  const gateParam = searchParams.get(GATE_QUERY_PARAM);

  const { isPublicView: profileIsPublic, publicCreatorId: profileCreatorId } =
    useCreatorChannelProfile();
  const storedUser = useStoredLoginUser();

  const publicCreatorId =
    customCreatorId !== undefined ? customCreatorId : profileCreatorId;
  const isPublicView =
    customCreatorId !== undefined ? Boolean(customCreatorId) : profileIsPublic;

  const { creator: publicCreator, isLoading: isLoadingPublic } =
    useCreatorPublicProfile(isPublicView ? publicCreatorId : null);

  const { data: privateSettings, isLoading: isLoadingPrivate } =
    useContentSettings();

  const targetCreatorId = publicCreatorId || publicCreator?.id;
  const currentUserId = storedUser?.id;

  const storageKey = getCreatorUnlockStorageKey(targetCreatorId, currentUserId);
  const isUnlocked =
    typeof window !== "undefined" && storageKey
      ? window.localStorage.getItem(storageKey) === "true"
      : false;

  const isOwner =
    !isPublicView ||
    (Boolean(targetCreatorId) &&
      storedUser &&
      storedUser.id === targetCreatorId);

  const isLoading = isPublicView ? isLoadingPublic : isLoadingPrivate;

  const accessType = isPublicView
    ? publicCreator?.accessType
    : privateSettings?.data?.accessType;

  const resolvedGateType: AccessGateType | null =
    accessType === SET_PASSWORD_ACCESS || accessType === ACCESS_TYPE_PASSWORD
      ? TYPE_CODE
      : accessType === REQUEST_EMAIL_ACCESS ||
          accessType === ACCESS_TYPE_EMAIL_GATED
        ? TYPE_EMAIL
        : null;

  const finalGateType: AccessGateType | null =
    isUnlocked || isOwner
      ? null
      : gateParam === TYPE_CODE || gateParam === TYPE_EMAIL
        ? gateParam
        : isLoading
          ? null
          : resolvedGateType;

  const handleSuccess = async (value: string, name?: string) => {
    if (!targetCreatorId) return true;

    try {
      await (finalGateType === TYPE_CODE
        ? axiosClient.post(API.content.verifyCode(targetCreatorId), {
            code: value,
          })
        : finalGateType === TYPE_EMAIL && value
          ? axiosClient
              .post(API.creatorUsers.register, {
                creatorId: targetCreatorId,
                email: value,
                name,
                source: REGISTER_SOURCE.CREATOR_PAGE,
                sourceId: targetCreatorId,
              })
              .catch(() => {})
          : Promise.resolve());

      unlockCreatorAccessGate(targetCreatorId, currentUserId);
      return true;
    } catch {
      return false;
    }
  };

  return { gateType: finalGateType, isLoading, handleSuccess };
}
