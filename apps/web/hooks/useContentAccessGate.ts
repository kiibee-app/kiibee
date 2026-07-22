"use client";

import { useSearchParams } from "next/navigation";
import { useCreatorAccessGate } from "./useCreatorAccessGate";
import { useCollectionAccessGate } from "./useCollectionAccessGate";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import {
  GATE_QUERY_PARAM,
  TYPE_CODE,
  TYPE_EMAIL,
  ACCESS_TYPE_PASSWORD,
  ACCESS_TYPE_EMAIL_GATED,
  SET_PASSWORD_ACCESS,
  REQUEST_EMAIL_ACCESS,
} from "@/utils/Constants";
import type { AccessGateType } from "@/components/Feature/AccessGate";
import type { ContentDetailItem } from "@/utils/contentApi";
import { axiosClient } from "@/lib/http/axiosClient";
import { API } from "@/lib/http/api/endpoints";

export function useContentAccessGate(
  content: ContentDetailItem | undefined,
  collectionId?: string | null,
): {
  gateType: AccessGateType | null;
  isLoading: boolean;
  handleSuccess: (value: string) => Promise<boolean>;
} {
  const searchParams = useSearchParams();
  const gateParam = searchParams.get(GATE_QUERY_PARAM);
  const storedUser = useStoredLoginUser();

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
  const isContentUnlocked =
    typeof window !== "undefined" && contentStorageKey
      ? window.localStorage.getItem(contentStorageKey) === "true"
      : false;

  const isOwner = Boolean(
    storedUser?.id && content?.creatorId === storedUser.id,
  );

  const hasContentGate = isContentCode || isContentEmail;
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

  const handleSuccess = async (value: string) => {
    await (finalGateType === TYPE_CODE && content?.id
      ? axiosClient.post(API.content.verifyCode(content.id), { code: value })
      : Promise.resolve());

    if (!isOwner) {
      if (isContentLocked && content?.id) {
        window.localStorage.setItem(
          `kiibee:gate:unlocked:content:${content.id}`,
          "true",
        );
      } else if (!hasContentGate && collectionGateType && collectionId) {
        window.localStorage.setItem(
          `kiibee:gate:unlocked:collection:${collectionId}`,
          "true",
        );
      } else if (!hasContentGate && creatorGateType && content?.creatorId) {
        window.localStorage.setItem(
          `kiibee:gate:unlocked:creator:${content.creatorId}`,
          "true",
        );
      }
    }
    window.location.reload();
    return true;
  };

  return {
    gateType: finalGateType,
    isLoading: creatorLoading || collectionLoading,
    handleSuccess,
  };
}
