"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import {
  ACCESS_TYPE_FREE,
  ACCESS_KEYWORD_EN,
  ACCESS_KEYWORD_DA,
  ORDER_TYPES,
  type OrderItemType,
  STRING,
  ROLE_CREATOR,
  UNDEFINED_STRING,
  REDIRECT_NEXT_QUERY_PARAM,
  ACTION_LOGIN,
  ACTION_SIGNUP,
} from "@/utils/Constants";
import { usePostAPI } from "@/lib/http/api/postApi";
import { API } from "@/lib/http/api/endpoints";
import { useApiErrorMessage } from "@/lib/http/useApiErrorMessage";
import { useContentMediaUrl } from "@/hooks/useContentMediaUrl";
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
import { resolveImageUrl } from "@/utils/media";

import { LoginRequiredModal, GenericModal } from "@/components/UI/Modals";
import { useLogout } from "@/hooks/auth/useLogout";
import { PATHS } from "@/utils/path";

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
  } = props;
  const router = useRouter();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const user = useStoredLoginUser();
  const { getErrorMessage } = useApiErrorMessage();
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [pendingPlaybackAfterLogin, setPendingPlaybackAfterLogin] =
    useState(false);

  const handleShowLoginModal = () => setLoginModalVisible(true);
  const handleCloseLoginModal = () => {
    setLoginModalVisible(false);
    setPendingPlaybackAfterLogin(false);
  };

  const { logout, isPending: isLoggingOut } = useLogout();
  const [showCreatorModal1, setShowCreatorModal1] = useState(false);
  const [showCreatorModal2, setShowCreatorModal2] = useState(false);
  const [creatorModal2Action, setCreatorModal2Action] = useState<
    typeof ACTION_LOGIN | typeof ACTION_SIGNUP | null
  >(null);

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
        return action;
      }

      return {
        ...action,
        disabled: action.disabled || createOrderMutation.isPending,
        onClick: async () => {
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
    primaryAction,
    primaryActions,
    t,
    user?.role,
  ]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [activePlaybackSrc, setActivePlaybackSrc] = useState("");
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
        } else {
          setSelectedAction({
            label: action.label,
            subtitle: action.subtitle,
            isPurchase: action.label
              .toLowerCase()
              .includes(t("pricingLabels.buy").toLowerCase()),
          });
          setShowPurchaseModal(true);
        }

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
  const hasViewerAccess = Boolean(content?.accessInfo);
  const fallbackPlaybackSrc =
    previewMediaUrl || hero.contentUrl || hero.media?.src || "";

  const canPreview =
    isPreviewableType && Boolean(fallbackPlaybackSrc || canFetchMedia);

  const openPreview = async () => {
    const playbackSrc = canFetchMedia
      ? (await fetchMediaUrl()) || fallbackPlaybackSrc
      : fallbackPlaybackSrc;

    if (!playbackSrc) {
      return;
    }

    setActivePlaybackSrc(playbackSrc);
    setShowPreviewModal(true);
  };

  const playContent = async () => {
    if (isWebType && fallbackPlaybackSrc) {
      window.open(fallbackPlaybackSrc, "_blank", "noopener,noreferrer");
      return;
    }

    await openPreview();
  };

  const requireLoginForPlayback = () => {
    if (user?.id) {
      return false;
    }

    setPendingPlaybackAfterLogin(true);
    handleShowLoginModal();
    return true;
  };

  const handleLoginSuccess = async () => {
    const shouldPlay = pendingPlaybackAfterLogin;
    setPendingPlaybackAfterLogin(false);

    if (shouldPlay) {
      await playContent();
    }
  };

  const handlePrimaryActionClick = async () => {
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

    const accessMeta = metaItems.find(
      (item) =>
        item.label.toLowerCase().includes(ACCESS_KEYWORD_EN) ||
        item.label.toLowerCase().includes(ACCESS_KEYWORD_DA),
    );
    const isPaid =
      accessMeta &&
      typeof accessMeta.value === STRING &&
      accessMeta.value !== ACCESS_TYPE_FREE;

    const actionLabel = primaryAction?.label?.toLowerCase();
    const isPurchaseAction = Boolean(
      actionLabel?.includes(t("pricingLabels.buy").toLowerCase()),
    );
    const isRentalAction = Boolean(
      actionLabel?.includes(t("pricingLabels.rent").toLowerCase()),
    );

    if ((isPaid || isPurchaseAction || isRentalAction) && !hasViewerAccess) {
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
      return;
    }

    if (requireLoginForPlayback()) {
      return;
    }

    await playContent();
  };

  const modifiedPrimaryAction = primaryAction
    ? {
        ...primaryAction,
        onClick: handlePrimaryActionClick,
        disabled: primaryAction.disabled || isMediaLoading,
      }
    : undefined;

  const bodyPrimaryActions: SingleContentAction[] | undefined =
    primaryActions != null
      ? actionsWithPayment
      : modifiedPrimaryAction
        ? [modifiedPrimaryAction]
        : undefined;

  const { share, shareUrl, showShareModal, setShowShareModal } = useShare();
  const isPdfLayout =
    Boolean(previewContentType) && previewContentType !== FORMAT_TYPE.VIDEO;

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
    <Wrapper>
      <SingleContentTopBar
        showBack={showBack}
        showShare={showShare}
        shareLabel={shareLabel}
        onBackClick={handleBack}
        onShare={onShare ?? share}
      />
      <Card>
        <ContentLayout $isPdf={isPdfLayout}>
          <SingleContentHero hero={hero} isPdfLayout={isPdfLayout} />

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
      {showPreviewModal && activePlaybackSrc && (
        <ContentPreviewModal
          visible={showPreviewModal}
          onClose={() => {
            setShowPreviewModal(false);
            setActivePlaybackSrc("");
          }}
          src={activePlaybackSrc}
          type={previewContentType || hero.media?.type || FORMAT_TYPE.VIDEO}
          title={title}
        />
      )}

      <PurchaseModal
        visible={showPurchaseModal}
        onClose={handleClosePurchaseModal}
        onPurchase={handlePurchaseConfirm}
        onRequireLogin={handleShowLoginModal}
        isLoggedIn={Boolean(user?.id)}
        title={title}
        image={hero.image ? resolveImageUrl(hero.image) : undefined}
        imageAlt={hero.imageAlt}
        creator={creator?.name}
        contentType={hero.contentType || hero.media?.type}
        priceLabel={selectedAction?.label || ""}
        accessLabel={selectedAction?.subtitle}
        contentId={contentId}
        loading={createOrderMutation.isPending}
      />

      <LoginRequiredModal
        visible={isLoginModalVisible}
        onClose={handleCloseLoginModal}
        onSuccess={handleLoginSuccess}
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
        onConfirm={() => {
          setCreatorModal2Action(ACTION_LOGIN);
          setShowCreatorModal2(true);
        }}
        onCancel={() => {
          setCreatorModal2Action(ACTION_SIGNUP);
          setShowCreatorModal2(true);
        }}
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
