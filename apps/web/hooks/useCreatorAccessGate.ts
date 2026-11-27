"use client";

import { useChannelCodeVisit } from "./useChannelCodeVisit";
import { rememberChannelCodeVisit } from "@/utils/channelCodeVisit";
import { useChannelOwnerAccess } from "@/hooks/useChannelOwnerAccess";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { savePaymentReturnUrl } from "@/utils/paymentReturn";
import { useRef } from "react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import type { AccessGateType } from "@/components/Feature/AccessGate";
import { isBrowser } from "@/utils/ui";
import {
  GATE_QUERY_PARAM,
  TYPE_CODE,
  TYPE_EMAIL,
  SET_PASSWORD_ACCESS,
  REQUEST_EMAIL_ACCESS,
  ACCESS_TYPE_PASSWORD,
  ACCESS_TYPE_EMAIL_GATED,
  REGISTER_SOURCE,
  STRING_TRUE,
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
  accessBoxText?: string | null;
  paymentOptions?: {
    buyPrice?: string | number | null;
    rentPrice?: string | number | null;
    rentDuration?: string | null;
  };
  hasProfilePaymentAccess: boolean;
  hasProfileCodeAccess: boolean;
  isLoading: boolean;
  handleSuccess: (value: string, name?: string) => Promise<boolean>;
  showAccessGranted: boolean;
  closeAccessGranted: () => void;
  isLoginModalVisible: boolean;
  closeLoginModal: () => void;
} {
  const [unlockedCreatorInSession, setUnlockedCreatorInSession] = useState<
    string | null
  >(null);
  const [accessGrantedCreatorId, setAccessGrantedCreatorId] = useState<
    string | null
  >(null);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const gateParam = searchParams.get(GATE_QUERY_PARAM);

  const { isPublicView: profileIsPublic, publicCreatorId: profileCreatorId } =
    useCreatorChannelProfile(customCreatorId === undefined);
  const storedUser = useStoredLoginUser();

  const publicCreatorId =
    customCreatorId !== undefined ? customCreatorId : profileCreatorId;
  const isPublicView =
    customCreatorId !== undefined ? Boolean(customCreatorId) : profileIsPublic;

  const { creator: publicCreator, isLoading: isLoadingPublic } =
    useCreatorPublicProfile(isPublicView ? publicCreatorId : null);

  const { data: privateSettings, isLoading: isLoadingPrivate } =
    useContentSettings(!isPublicView && Boolean(storedUser?.id));

  const targetCreatorId = publicCreator?.id || publicCreatorId;
  const currentUserId = storedUser?.id;
  const canonicalCreatorId = publicCreator?.id || targetCreatorId;
  const checkoutKey = useRef<string | null>(null);
  const { data: paymentState, isLoading: paymentLoading } = useQuery({
    queryKey: ["profile-payment", canonicalCreatorId, currentUserId],
    enabled: Boolean(isPublicView && canonicalCreatorId),
    queryFn: async () => {
      const route =
        currentUserId && currentUserId !== canonicalCreatorId
          ? "profile-entitlement"
          : "profile-payment";
      const result = await axiosClient.get(
        `/content/${route}/${encodeURIComponent(canonicalCreatorId!)}`,
      );
      return result.data.data as {
        accessBoxText?: string | null;
        required: boolean;
        codeRequired?: boolean;
        hasAccess: boolean;
        collectionId?: string;
        buyPrice?: string | number | null;
        rentPrice?: string | number | null;
        rentDuration?: string | null;
      };
    },
    staleTime: 0,
    refetchInterval: 30_000,
  });

  const storageKey = getCreatorUnlockStorageKey(targetCreatorId, currentUserId);
  const isStoredUnlock =
    isBrowser && storageKey
      ? window.localStorage.getItem(`${storageKey}:email`) === STRING_TRUE
      : false;
  const isOwnPublicChannel =
    isPublicView && currentUserId === canonicalCreatorId;
  const hasCodeVisit = useChannelCodeVisit(canonicalCreatorId, currentUserId);
  const hasProfileCodeAccess = Boolean(
    paymentState?.codeRequired && paymentState.hasAccess && hasCodeVisit,
  );
  const isUnlocked = paymentState?.codeRequired
    ? hasProfileCodeAccess ||
      (isOwnPublicChannel && unlockedCreatorInSession === targetCreatorId)
    : unlockedCreatorInSession === targetCreatorId || isStoredUnlock;
  const showAccessGranted = accessGrantedCreatorId === targetCreatorId;

  const hasOwnerAccess = useChannelOwnerAccess(
    Boolean(targetCreatorId && currentUserId === targetCreatorId),
  );
  const isOwner = !isPublicView || hasOwnerAccess;

  const isLoading = isPublicView
    ? isLoadingPublic || paymentLoading
    : isLoadingPrivate;

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

  const needsProfilePayment =
    !isOwner &&
    ((paymentState?.required && !paymentState.hasAccess) ||
      (!paymentState && ["payment", "paid"].includes(accessType ?? "")));
  const finalGateType: AccessGateType | null = needsProfilePayment
    ? "payment"
    : isUnlocked || isOwner
      ? null
      : gateParam === TYPE_CODE || gateParam === TYPE_EMAIL
        ? gateParam
        : isLoading
          ? null
          : resolvedGateType;

  const handleSuccess = async (value: string, name?: string) => {
    if (!targetCreatorId || !finalGateType) return false;
    if (finalGateType === "payment") {
      if (!currentUserId) {
        setIsLoginModalVisible(true);
        return false;
      }
      if (
        !paymentState?.collectionId ||
        !["purchase", "rental"].includes(value)
      )
        return false;
      checkoutKey.current ??= crypto.randomUUID();
      savePaymentReturnUrl();
      const { data: result } = await axiosClient.post(
        "/order/collection/create",
        {
          collectionId: paymentState.collectionId,
          itemType: value,
          idempotencyKey: checkoutKey.current,
        },
      );
      if (!result.success) throw new Error(result.message);
      if (result.data?.completed)
        window.location.assign(
          `/payment/success?orderId=${encodeURIComponent(result.data.orderId)}`,
        );
      else if (result.data?.url) window.location.assign(result.data.url);
      else throw new Error("Payment could not be started");
      return true;
    }

    if (finalGateType === TYPE_CODE && !currentUserId) {
      setIsLoginModalVisible(true);
      return false;
    }

    const request =
      finalGateType === TYPE_CODE
        ? axiosClient.post(API.content.verifyCode(targetCreatorId), {
            code: value,
          })
        : axiosClient.post(API.creatorUsers.register, {
            creatorId: targetCreatorId,
            email: value,
            name,
            source: REGISTER_SOURCE.CREATOR_PAGE,
            sourceId: targetCreatorId,
          });

    await request;
    if (finalGateType === TYPE_CODE) {
      rememberChannelCodeVisit(canonicalCreatorId, currentUserId);
      await queryClient.invalidateQueries({
        queryKey: ["profile-payment", canonicalCreatorId],
      });
    } else {
      unlockCreatorAccessGate(targetCreatorId, currentUserId, false);
    }
    setUnlockedCreatorInSession(targetCreatorId);
    setAccessGrantedCreatorId(targetCreatorId);
    return true;
  };

  return {
    accessBoxText: isPublicView
      ? paymentState?.accessBoxText
      : privateSettings?.data?.accessBoxText,
    gateType: finalGateType,
    paymentOptions: paymentState,
    hasProfileCodeAccess,
    hasProfilePaymentAccess: Boolean(
      paymentState?.required && paymentState.hasAccess,
    ),
    isLoading,
    handleSuccess,
    showAccessGranted,
    closeAccessGranted: () => setAccessGrantedCreatorId(null),
    isLoginModalVisible,
    closeLoginModal: () => setIsLoginModalVisible(false),
  };
}
