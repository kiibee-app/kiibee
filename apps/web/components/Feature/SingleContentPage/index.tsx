"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import {
  ACCESS_TYPE_FREE,
  ACCESS_TYPE_RENTED,
  ACCESS_KEYWORD_EN,
  ACCESS_KEYWORD_DA,
  ORDER_TYPES,
  type OrderItemType,
  STRING,
  VIEW,
  CONTENT_COLLECTION_QUERY_KEY,
  CONTENT_ITEM_QUERY_KEY,
  VARIANT,
  ROLE_CREATOR,
  UNDEFINED_STRING,
  REDIRECT_NEXT_QUERY_PARAM,
  ACTION_LOGIN,
  ACTION_SIGNUP,
} from "@/utils/Constants";
import { PATHS } from "@/utils/path";
import { CREATORS_LABELS } from "@/utils/SidebarItems";
import { usePostAPI } from "@/lib/http/api/postApi";
import { API } from "@/lib/http/api/endpoints";
import { useApiErrorMessage } from "@/lib/http/useApiErrorMessage";
import { useContentMediaUrl } from "@/hooks/useContentMediaUrl";
import { useContentDownload } from "@/hooks/useContentDownload";
import { savePaymentReturnUrl } from "@/utils/paymentReturn";
import { toast } from "react-toastify";
import {
  SingleContentBody,
  SingleContentHero,
  SingleContentTopBar,
} from "./ContentSections";
import { Card, ContentLayout, Wrapper } from "./styles";
import type {
  SingleContentPageProps,
  SingleContentAction,
} from "@/types/contentTypes";
import { FORMAT_TYPE } from "@/utils/types";
import useShare from "@/hooks/useShare";
import ContentPreviewModal from "./ContentPreviewModal";
import PurchaseModal from "./PurchaseModal";
import ShareModal from "@/components/UI/Modals/ShareModal";
import { isEmbeddableVideoUrl, resolveImageUrl } from "@/utils/media";
import { openInNewTab } from "@/utils/common";

import { LoginRequiredModal, GenericModal } from "@/components/UI/Modals";
import { useLogout } from "@/hooks/auth/useLogout";

import { useSearchParams } from "next/navigation";

export type {
  SingleContentHeroProps,
  SingleContentMetaItem,
  SingleContentPageProps,
} from "@/types/contentTypes";

export default function SingleContentPage(props: SingleContentPageProps) {
  const {
    contentId,
    collectionId,
    content,
    title,
    descriptions = [],
    tags = [],
    statusLabel,
    expiry,
    creator,
    hero,
    primaryAction,
    primaryActions,
    metaItems = [],
    shareLabel = "Share",
    showShare = true,
    showBack = true,
    onBack,
    onShare,
    children,
    accessGate,
    embedded = false,
  } = props;
  const router = useRouter();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const user = useStoredLoginUser();
  const { getErrorMessage } = useApiErrorMessage();
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [loginModalMessage, setLoginModalMessage] = useState<
    string | undefined
  >(undefined);

  const [showCreatorModal1, setShowCreatorModal1] = useState(false);
  const [showCreatorModal2, setShowCreatorModal2] = useState(false);
  const [creatorModal2Action, setCreatorModal2Action] = useState<
    typeof ACTION_LOGIN | typeof ACTION_SIGNUP | null
  >(null);
  const { logout, isPending: isLoggingOut } = useLogout();

  const handleConfirmModal2 = async () => {
    const returnUrl =
      typeof window !== UNDEFINED_STRING
        ? window.location.pathname + window.location.search
        : "";
    const redirectUrl =
      creatorModal2Action === ACTION_SIGNUP
        ? `${PATHS.AUTH_SIGNUP_VIEWER}?${REDIRECT_NEXT_QUERY_PARAM}=${encodeURIComponent(returnUrl)}`
        : `${PATHS.AUTH_LOGIN}?${REDIRECT_NEXT_QUERY_PARAM}=${encodeURIComponent(returnUrl)}`;
    await logout(redirectUrl);
  };

  const handleCreatorModal1Confirm = () => {
    setCreatorModal2Action(ACTION_LOGIN);
    setShowCreatorModal2(true);
  };

  const handleCreatorModal1Cancel = () => {
    setCreatorModal2Action(ACTION_SIGNUP);
    setShowCreatorModal2(true);
  };

  const handleShowLoginModal = useCallback((msg?: string) => {
    setLoginModalMessage(msg);
    setLoginModalVisible(true);
  }, []);

  const handleCloseLoginModal = useCallback(() => {
    setLoginModalVisible(false);
    setLoginModalMessage(undefined);
  }, []);

  type CreateOrderPayload = {
    contentId: string;
    collectionId?: string;
    itemType: OrderItemType;
    couponCode?: string;
    subscriptionId?: string;
  };

  type CreateOrderResponse = {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
      orderId: string;
      url?: string;
    };
  };

  const createOrderMutation = usePostAPI<
    CreateOrderResponse,
    CreateOrderPayload
  >(API.order.create);

  const handleActionClick = useCallback(
    (action: SingleContentAction) => {
      if (!user?.id) {
        handleShowLoginModal();
        return;
      }

      action.onClick?.();
    },
    [handleShowLoginModal, user?.id],
  );

  const actionsWithPayment = useMemo(() => {
    const actions = primaryActions ?? (primaryAction ? [primaryAction] : []);

    if (!actions.length || !contentId) {
      return actions;
    }

    return actions.map((action) => {
      const normalizedLabel = action.label.toLowerCase();
      const isPurchase = normalizedLabel.includes(
        t("pricingLabels.buy").toLowerCase(),
      );
      const isRental = normalizedLabel.includes(
        t("pricingLabels.rent").toLowerCase(),
      );

      if (!isPurchase && !isRental) {
        return {
          ...action,
          onClick: () => handleActionClick(action),
        };
      }

      return {
        ...action,
        disabled: action.disabled || createOrderMutation.isPending,
        onClick: async () => {
          if (!user?.id) {
            handleShowLoginModal(
              t("createProfileHome.latestUpload.loginModal.message"),
            );
            return;
          }
          if (user?.role === ROLE_CREATOR) {
            setShowCreatorModal1(true);
            return;
          }
          setSelectedAction({
            label: action.label,
            subtitle: action.subtitle,
            isPurchase,
          });
          setShowPurchaseModal(true);
        },
      };
    });
  }, [
    contentId,
    createOrderMutation,
    handleActionClick,
    handleShowLoginModal,
    primaryAction,
    primaryActions,
    t,
    user?.id,
    user?.role,
  ]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<{
    label: string;
    subtitle?: string;
    isPurchase: boolean;
  } | null>(null);

  const {
    contentType,
    previewMediaUrl,
    isLoading: isMediaLoading,
    canFetchMedia,
    fetchMediaUrl,
  } = useContentMediaUrl(content);
  const previewContentType = contentType ?? hero.contentType;

  const isPreviewableType =
    previewContentType === FORMAT_TYPE.PDF ||
    previewContentType === FORMAT_TYPE.WEB ||
    previewContentType === FORMAT_TYPE.EPUB ||
    previewContentType === FORMAT_TYPE.VIDEO ||
    previewContentType === FORMAT_TYPE.AUDIO;

  useEffect(() => {
    const intent = searchParams?.get("intent");
    if (intent) {
      const actions = primaryActions ?? (primaryAction ? [primaryAction] : []);
      if (actions.length) {
        const action = actions[0];
        if (user?.role === ROLE_CREATOR) {
          setShowCreatorModal1(true);
          return;
        }

        setSelectedAction({
          label: action.label,
          subtitle: action.subtitle,
          isPurchase: action.label
            .toLowerCase()
            .includes(t("pricingLabels.buy").toLowerCase()),
        });
        setShowPurchaseModal(true);

        const newUrl =
          window.location.pathname +
          window.location.search
            .replace(new RegExp(`&?intent=${intent}`), "")
            .replace(/\?$/, "");
        window.history.replaceState({}, "", newUrl);
      }
    }
  }, [searchParams, primaryActions, primaryAction, t, user?.role]);

  const isWebType = hero?.contentType === FORMAT_TYPE.WEB;

  const canPreview =
    isPreviewableType &&
    (Boolean(hero?.media?.src || hero?.contentUrl) ||
      canFetchMedia ||
      Boolean(previewMediaUrl));

  const handlePrimaryActionClick = useCallback(async () => {
    if (!user?.id) {
      handleShowLoginModal();
      return;
    }

    if (
      isWebType &&
      previewMediaUrl &&
      !isEmbeddableVideoUrl(previewMediaUrl) &&
      !isEmbeddableVideoUrl(hero.contentUrl)
    ) {
      openInNewTab(previewMediaUrl);
      return;
    }

    if (!canPreview) {
      if (primaryAction?.onClick) {
        primaryAction.onClick();
        return;
      }

      const accessMeta = metaItems.find(
        (item) =>
          item.label.toLowerCase().includes(ACCESS_KEYWORD_EN) ||
          item.label.toLowerCase().includes(ACCESS_KEYWORD_DA),
      );
      const isPaid =
        accessMeta &&
        typeof accessMeta.value === STRING &&
        accessMeta.value !== ACCESS_TYPE_FREE;

      if (isPaid && !user?.id) {
        handleShowLoginModal();
      }
      return;
    }

    if (!canFetchMedia) {
      setShowPreviewModal(true);
      return;
    }

    const actionLabel = primaryAction?.label?.toLowerCase();
    const isPurchaseAction = Boolean(
      actionLabel?.includes(t("pricingLabels.buy").toLowerCase()),
    );
    const isRentalAction = Boolean(
      actionLabel?.includes(t("pricingLabels.rent").toLowerCase()),
    );

    if (isPurchaseAction || isRentalAction) {
      if (user?.role === ROLE_CREATOR) {
        setShowCreatorModal1(true);
        return;
      }
      setSelectedAction({
        label: primaryAction?.label as string,
        subtitle: primaryAction?.subtitle,
        isPurchase: isPurchaseAction,
      });

      setShowPurchaseModal(true);
    } else {
      const mediaUrl = await fetchMediaUrl();
      if (mediaUrl) {
        setShowPreviewModal(true);
      }
    }
  }, [
    canFetchMedia,
    canPreview,
    fetchMediaUrl,
    handleShowLoginModal,
    hero.contentUrl,
    isWebType,
    metaItems,
    previewMediaUrl,
    primaryAction,
    t,
    user?.id,
    user?.role,
  ]);

  const modifiedPrimaryAction = useMemo(
    () =>
      primaryAction
        ? {
            ...primaryAction,
            onClick: handlePrimaryActionClick,
            disabled: primaryAction.disabled || isMediaLoading,
          }
        : undefined,
    [handlePrimaryActionClick, isMediaLoading, primaryAction],
  );

  const isOwner = Boolean(user?.id && content?.creatorId === user.id);
  const hasViewerAccess = Boolean(content?.accessInfo);

  const heroPrimaryAction = accessGate ? undefined : modifiedPrimaryAction;

  const openOwnerContentInDashboard = useCallback(() => {
    const params = new URLSearchParams({
      [VIEW]: CREATORS_LABELS.CONTENTS,
    });

    if (collectionId) {
      params.set(CONTENT_COLLECTION_QUERY_KEY, collectionId);
      if (contentId) {
        params.set(CONTENT_ITEM_QUERY_KEY, contentId);
      }
    }

    router.push(`${PATHS.DASHBOARD_CREATOR}?${params.toString()}`);
  }, [collectionId, contentId, router]);

  const isDownloadableType =
    previewContentType === FORMAT_TYPE.AUDIO ||
    previewContentType === FORMAT_TYPE.PDF ||
    previewContentType === FORMAT_TYPE.EPUB;

  const isRented = content?.accessInfo?.accessType === ACCESS_TYPE_RENTED;

  const shouldEnableDownload = Boolean(
    user?.id &&
    contentId &&
    isDownloadableType &&
    !isRented &&
    (hasViewerAccess || isOwner),
  );

  const { downloadInfo, isDownloading, triggerDownload } = useContentDownload(
    contentId,
    shouldEnableDownload,
  );

  const bodyPrimaryActions = useMemo(() => {
    const baseActions: SingleContentAction[] | undefined =
      primaryActions != null
        ? actionsWithPayment
        : modifiedPrimaryAction
          ? isOwner
            ? [
                {
                  label: t("singleContent.openInDashboard"),
                  variant: VARIANT.PRIMARY,
                  onClick: openOwnerContentInDashboard,
                },
                {
                  ...modifiedPrimaryAction,
                  variant: VARIANT.SECONDARY,
                },
              ]
            : [
                {
                  ...modifiedPrimaryAction,
                  variant: hasViewerAccess ? VARIANT.PRIMARY : undefined,
                },
              ]
          : undefined;

    const canShowDownload = Boolean(
      shouldEnableDownload &&
      downloadInfo &&
      downloadInfo.maxDownloadLimit > 0 &&
      baseActions,
    );

    if (canShowDownload && baseActions && downloadInfo) {
      const downloadAction: SingleContentAction = {
        label: t("singleContent.download"),
        subtitle: t("singleContent.remainingDownloads", {
          count: downloadInfo.remainingDownloads,
        }),
        variant: VARIANT.SOFT_OUTLINE,
        disabled: isDownloading || downloadInfo.remainingDownloads <= 0,
        onClick: () => triggerDownload(title),
      };

      return [...baseActions, downloadAction];
    }

    return baseActions;
  }, [
    actionsWithPayment,
    downloadInfo,
    hasViewerAccess,
    isDownloading,
    isOwner,
    modifiedPrimaryAction,
    openOwnerContentInDashboard,
    primaryActions,
    shouldEnableDownload,
    t,
    title,
    triggerDownload,
  ]);

  const { share, shareUrl, showShareModal, setShowShareModal } = useShare();
  const isPdfLayout =
    Boolean(previewContentType) &&
    previewContentType !== FORMAT_TYPE.VIDEO &&
    previewContentType !== FORMAT_TYPE.AUDIO;

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    router.back();
  };

  const handlePurchaseConfirm = async (
    couponCode?: string,
    subscriptionId?: string,
  ) => {
    if (!selectedAction || !contentId) return;

    if (!user?.id) {
      handleShowLoginModal();
      return;
    }

    try {
      savePaymentReturnUrl();
      const response = await createOrderMutation.mutateAsync({
        contentId,
        collectionId,
        itemType: selectedAction.isPurchase
          ? ORDER_TYPES.PURCHASE
          : ORDER_TYPES.RENTAL,
        ...(couponCode ? { couponCode } : {}),
        ...(subscriptionId ? { subscriptionId } : {}),
      });
      const paymentUrl = response?.data?.url;
      const orderId = response?.data?.orderId;
      if (!paymentUrl && subscriptionId && orderId) {
        setShowPurchaseModal(false);
        setSelectedAction(null);
        router.push(`/payment/success?orderId=${encodeURIComponent(orderId)}`);
        return;
      }
      if (!paymentUrl) {
        throw new Error("Payment URL missing");
      }
      setShowPurchaseModal(false);
      setSelectedAction(null);
      window.location.assign(paymentUrl);
    } catch (error) {
      const message = getErrorMessage(error, "errors.saveChangesFailed");
      toast.error(message);
    }
  };

  const handleClosePurchaseModal = () => {
    setShowPurchaseModal(false);
    setSelectedAction(null);
  };

  return (
    <Wrapper $embedded={embedded}>
      <SingleContentTopBar
        showBack={showBack}
        showShare={showShare}
        shareLabel={shareLabel}
        onBackClick={handleBack}
        onShare={onShare ?? share}
        embedded={embedded}
      />
      <Card>
        <ContentLayout $isPdf={isPdfLayout}>
          <SingleContentHero
            hero={hero}
            isPdfLayout={isPdfLayout}
            primaryAction={heroPrimaryAction}
          />

          <SingleContentBody
            creator={creator}
            statusLabel={statusLabel}
            title={title}
            descriptions={descriptions}
            tags={tags}
            primaryAction={modifiedPrimaryAction}
            primaryActions={bodyPrimaryActions}
            expiry={expiry}
            metaItems={metaItems}
            accessGate={accessGate}
          />
        </ContentLayout>
      </Card>

      {children}
      {canPreview &&
        showPreviewModal &&
        (previewMediaUrl || hero.contentUrl || hero.media?.src) && (
          <ContentPreviewModal
            visible={showPreviewModal}
            onClose={() => setShowPreviewModal(false)}
            src={previewMediaUrl || hero.contentUrl || hero.media?.src || ""}
            type={previewContentType || hero.media?.type || FORMAT_TYPE.VIDEO}
            title={title}
            coverImage={hero.image ? resolveImageUrl(hero.image) : undefined}
          />
        )}

      <PurchaseModal
        visible={showPurchaseModal}
        onClose={handleClosePurchaseModal}
        onPurchase={handlePurchaseConfirm}
        onRequireLogin={() =>
          handleShowLoginModal(
            t("createProfileHome.latestUpload.loginModal.message"),
          )
        }
        isLoggedIn={Boolean(user?.id)}
        title={title}
        image={hero.image ? resolveImageUrl(hero.image) : undefined}
        imageAlt={hero.imageAlt}
        creator={creator?.name}
        contentType={hero.contentType || hero.media?.type}
        priceLabel={selectedAction?.label || ""}
        accessLabel={selectedAction?.subtitle}
        contentId={contentId}
        isPurchase={selectedAction?.isPurchase}
        loading={createOrderMutation.isPending}
      />

      <LoginRequiredModal
        visible={isLoginModalVisible}
        onClose={handleCloseLoginModal}
        message={loginModalMessage}
        onSuccess={() => {
          handleCloseLoginModal();
        }}
      />

      <ShareModal
        visible={showShareModal}
        url={shareUrl}
        onClose={() => setShowShareModal(false)}
      />

      <GenericModal
        visible={showCreatorModal1}
        onClose={() => setShowCreatorModal1(false)}
        title={t("creatorPurchaseFlow.modal1.title")}
        message={t("creatorPurchaseFlow.modal1.message")}
        confirmLabel={t("creatorPurchaseFlow.modal1.primaryBtn")}
        cancelLabel={t("creatorPurchaseFlow.modal1.secondaryBtn")}
        onConfirm={handleCreatorModal1Confirm}
        onCancel={handleCreatorModal1Cancel}
        buttonRow={false}
        fullWidthButtons
      />

      <GenericModal
        visible={showCreatorModal2}
        onClose={() => setShowCreatorModal2(false)}
        title={t("creatorPurchaseFlow.modal2.title")}
        confirmLabel={t("creatorPurchaseFlow.modal2.primaryBtn")}
        cancelLabel={t("creatorPurchaseFlow.modal2.secondaryBtn")}
        onConfirm={handleConfirmModal2}
        onCancel={() => {
          setShowCreatorModal1(true);
        }}
        confirmLoading={isLoggingOut}
        confirmDisabled={isLoggingOut}
        buttonRow={true}
        fullWidthButtons
        closeOnConfirm={false}
      />
    </Wrapper>
  );
}
