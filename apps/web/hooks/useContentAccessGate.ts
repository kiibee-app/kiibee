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

export function useContentAccessGate(
  content: ContentDetailItem | undefined,
  collectionId?: string | null,
): {
  gateType: AccessGateType | null;
  isLoading: boolean;
  handleSuccess: () => void;
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

  const contentGateType =
    !isOwner && !isContentUnlocked
      ? isContentCode
        ? TYPE_CODE
        : isContentEmail
          ? TYPE_EMAIL
          : null
      : null;

  const hasCodeGate =
    contentGateType === TYPE_CODE ||
    collectionGateType === TYPE_CODE ||
    creatorGateType === TYPE_CODE;

  const hasEmailGate =
    contentGateType === TYPE_EMAIL ||
    collectionGateType === TYPE_EMAIL ||
    creatorGateType === TYPE_EMAIL;

  const resolvedGateType = hasCodeGate
    ? TYPE_CODE
    : hasEmailGate
      ? TYPE_EMAIL
      : null;

  const finalGateType = isOwner
    ? null
    : gateParam === TYPE_CODE || gateParam === TYPE_EMAIL
      ? gateParam
      : resolvedGateType;

  const handleSuccess = () => {
    if (contentGateType === TYPE_CODE && content?.id) {
      window.localStorage.setItem(
        `kiibee:gate:unlocked:content:${content.id}`,
        "true",
      );
    } else if (collectionGateType === TYPE_CODE && collectionId) {
      window.localStorage.setItem(
        `kiibee:gate:unlocked:collection:${collectionId}`,
        "true",
      );
    } else if (creatorGateType === TYPE_CODE && content?.creatorId) {
      window.localStorage.setItem(
        `kiibee:gate:unlocked:creator:${content.creatorId}`,
        "true",
      );
    } else if (contentGateType === TYPE_EMAIL && content?.id) {
      window.localStorage.setItem(
        `kiibee:gate:unlocked:content:${content.id}`,
        "true",
      );
    } else if (collectionGateType === TYPE_EMAIL && collectionId) {
      window.localStorage.setItem(
        `kiibee:gate:unlocked:collection:${collectionId}`,
        "true",
      );
    } else if (creatorGateType === TYPE_EMAIL && content?.creatorId) {
      window.localStorage.setItem(
        `kiibee:gate:unlocked:creator:${content.creatorId}`,
        "true",
      );
    }
    window.location.reload();
  };

  return {
    gateType: finalGateType,
    isLoading: creatorLoading || collectionLoading,
    handleSuccess,
  };
}
