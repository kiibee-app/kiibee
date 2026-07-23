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
  REGISTER_SOURCE,
} from "@/utils/Constants";
import { API } from "@/lib/http/api/endpoints";
import { axiosClient } from "@/lib/http/axiosClient";
import type { AccessGateType } from "@/components/Feature/AccessGate";
import type { ContentDetailItem } from "@/utils/contentApi";

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

    if (!isOwner) {
      if (finalGateType === TYPE_EMAIL && value && content?.creatorId) {
        await axiosClient
          .post(API.creatorUsers.register, {
            creatorId: content.creatorId,
            email: value,
            name,
            source: REGISTER_SOURCE.CONTENT,
            sourceId: content.id,
          })
          .catch(() => undefined);
      }

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
        const targetCreatorId = content.creatorId;
        const currentUserId = storedUser?.id;
        const storageKey = `kiibee:gate:unlocked:creator:creator=${targetCreatorId}${currentUserId ? `:user=${currentUserId}` : ""}`;
        window.localStorage.setItem(storageKey, "true");
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
