"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useCreatorAccessGate } from "./useCreatorAccessGate";
import { useCollectionAccessGate } from "./useCollectionAccessGate";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import { readStoredLoginUser } from "@/hooks/auth/useLogin";
import {
  GATE_QUERY_PARAM,
  TYPE_CODE,
  TYPE_EMAIL,
  ACCESS_TYPE_PASSWORD,
  ACCESS_TYPE_EMAIL_GATED,
  SET_PASSWORD_ACCESS,
  REQUEST_EMAIL_ACCESS,
} from "@/utils/Constants";
import { API } from "@/lib/http/api/endpoints";
import { axiosClient } from "@/lib/http/axiosClient";
import type { AccessGateType } from "@/components/Feature/AccessGate";
import type { ContentDetailItem } from "@/utils/contentApi";
import {
  getContentUnlockStorageKey,
  getCollectionUnlockStorageKey,
  getCreatorUnlockStorageKey,
} from "@/utils/accessGate";
import { pathLoginWithNext } from "@/utils/path";

export function useContentAccessGate(
  content: ContentDetailItem | undefined,
  collectionId?: string | null,
): {
  gateType: AccessGateType | null;
  isLoading: boolean;
  handleSuccess: (value: string, name?: string) => Promise<boolean>;
} {
  const searchParams = useSearchParams();
  const gateParam = searchParams.get(GATE_QUERY_PARAM);
  const approvedAccessToken = searchParams.get("approvedAccess");
  const storedUser = useStoredLoginUser();
  const loginUser = storedUser ?? readStoredLoginUser();
  const isApprovingAccess = Boolean(approvedAccessToken);

  const { gateType: creatorGateType, isLoading: creatorLoading } =
    useCreatorAccessGate(content?.creatorId);
  const { gateType: collectionGateType, isLoading: collectionLoading } =
    useCollectionAccessGate(collectionId);

  const isContentCode =
    content?.accessType === ACCESS_TYPE_PASSWORD ||
    content?.accessType === SET_PASSWORD_ACCESS;
  const isContentEmail =
    content?.accessType === ACCESS_TYPE_EMAIL_GATED ||
    content?.accessType === REQUEST_EMAIL_ACCESS;

  const contentStorageKey = content?.id
    ? `kiibee:gate:unlocked:content:${content.id}`
    : "";
  const isLocallyUnlocked =
    typeof window !== "undefined" && contentStorageKey
      ? window.localStorage.getItem(contentStorageKey) === "true"
      : false;

  const isOwner = Boolean(loginUser?.id && content?.creatorId === loginUser.id);

  useEffect(() => {
    if (!approvedAccessToken || !content?.id || !contentStorageKey) return;
    if (!loginUser?.id) {
      const returnTo = `${window.location.pathname}${window.location.search}`;
      window.location.replace(pathLoginWithNext(returnTo));
      return;
    }

    let cancelled = false;

    const redeemAccess = async () => {
      try {
        await axiosClient.post(API.creatorUsers.redeemContentAccess, {
          token: approvedAccessToken,
        });
      } catch {}

      if (cancelled) return;

      window.localStorage.setItem(contentStorageKey, "true");
      const url = new URL(window.location.href);
      url.searchParams.delete("approvedAccess");
      window.location.replace(url.toString());
    };

    void redeemAccess();

    return () => {
      cancelled = true;
    };
  }, [approvedAccessToken, content?.id, contentStorageKey, loginUser?.id]);

  const hasContentGate = isContentCode || isContentEmail;
  const hasServerAccess = Boolean(content?.accessInfo);
  const hasApprovedEmailAccess = Boolean(loginUser?.id && hasServerAccess);
  const isContentUnlocked = isContentEmail
    ? hasApprovedEmailAccess || isLocallyUnlocked
    : isLocallyUnlocked || hasServerAccess;
  const isContentLocked = hasContentGate && !isContentUnlocked;

  const resolvedGateType = isOwner
    ? null
    : hasContentGate
      ? isContentLocked
        ? isContentCode
          ? TYPE_CODE
          : TYPE_EMAIL
        : null
      : collectionGateType
        ? collectionGateType
        : creatorGateType;

  const finalGateType = isOwner
    ? null
    : gateParam === TYPE_CODE || gateParam === TYPE_EMAIL
      ? gateParam
      : resolvedGateType;

  const handleSuccess = async (value: string, name?: string) => {
    const targetId = isContentLocked
      ? content?.id
      : collectionGateType
        ? collectionId
        : creatorGateType
          ? content?.creatorId
          : undefined;
    await (finalGateType === TYPE_CODE && targetId
      ? axiosClient.post(API.content.verifyCode(targetId), { code: value })
      : Promise.resolve());

    if (
      !isOwner &&
      finalGateType === TYPE_EMAIL &&
      value &&
      content?.creatorId
    ) {
      await axiosClient.post(API.creatorUsers.requestContentAccess, {
        creatorId: content.creatorId,
        contentId: content.id,
        email: value,
        name,
      });
      return true;
    }

    const unlockStorageKey = [
      isContentLocked && content?.id
        ? getContentUnlockStorageKey(content.id)
        : "",
      !hasContentGate && collectionGateType && collectionId
        ? getCollectionUnlockStorageKey(collectionId)
        : "",
      !hasContentGate && creatorGateType
        ? getCreatorUnlockStorageKey(content?.creatorId, loginUser?.id)
        : "",
    ].find(Boolean);

    if (!isOwner && unlockStorageKey) {
      window.localStorage.setItem(unlockStorageKey, "true");
    }
    window.location.reload();
    return true;
  };

  return {
    gateType: finalGateType,
    isLoading: creatorLoading || collectionLoading || isApprovingAccess,
    handleSuccess,
  };
}
