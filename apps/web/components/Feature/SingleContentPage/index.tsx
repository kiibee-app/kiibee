"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import { PATHS } from "@/utils/path";
import {
  ACCESS_TYPE_FREE,
  ACCESS_KEYWORD_EN,
  ACCESS_KEYWORD_DA,
  ORDER_TYPES,
  type OrderItemType,
  STRING,
} from "@/utils/Constants";
import { usePostAPI } from "@/lib/http/api/postApi";
import { API } from "@/lib/http/api/endpoints";
import { useApiErrorMessage } from "@/lib/http/useApiErrorMessage";
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
import { resolveImageUrl } from "@/utils/media";
import { GenericModal } from "@/components/UI/Modals";
import { MonoText } from "@/components/UI/Monotext";
import { MODAL_ALIGN } from "@/utils/ui";
import {
  ModalContentWrapper,
  ModalDescription,
} from "@/components/Feature/ProfileLayout/shared/LatestUpload/styles";

export type {
  SingleContentHeroProps,
  SingleContentMetaItem,
  SingleContentPageProps,
} from "@/types/contentTypes";

export default function SingleContentPage(props: SingleContentPageProps) {
  const { t } = useTranslation();
  const {
    contentId,
    collectionId,
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
  const user = useStoredLoginUser();
  const { getErrorMessage } = useApiErrorMessage();
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);

  const handleShowLoginModal = () => setLoginModalVisible(true);
  const handleCloseLoginModal = () => setLoginModalVisible(false);
  const handleLoginRedirect = () => {
    const next = encodeURIComponent(
      window.location.pathname + window.location.search,
    );
    router.push(`${PATHS.AUTH_LOGIN}?next=${next}`);
  };
  const handleCreateAccount = () => router.push(PATHS.AUTH_SIGNUP);

  type CreateOrderPayload = {
    contentId: string;
    collectionId?: string;
    itemType: OrderItemType;
  };

  type CreateOrderResponse = {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
      orderId: string;
      url: string;
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
      const isPurchase = normalizedLabel.includes("buy");
      const isRental = normalizedLabel.includes("rent");

      if (!isPurchase && !isRental) {
        return action;
      }

      return {
        ...action,
        disabled: action.disabled || createOrderMutation.isPending,
        onClick: async () => {
          if (!user?.id) {
            handleShowLoginModal();
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
  }, [contentId, createOrderMutation, primaryAction, primaryActions, user?.id]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<{
    label: string;
    subtitle?: string;
    isPurchase: boolean;
  } | null>(null);

  const isPreviewableType =
    hero?.contentType === FORMAT_TYPE.PDF ||
    hero?.contentType === FORMAT_TYPE.WEB ||
    hero?.contentType === FORMAT_TYPE.EPUB ||
    hero?.contentType === FORMAT_TYPE.VIDEO ||
    hero?.contentType === FORMAT_TYPE.AUDIO;

  const isWebType = hero?.contentType === FORMAT_TYPE.WEB;

  const canPreview =
    isPreviewableType && Boolean(hero?.media?.src || hero?.contentUrl);

  const handlePrimaryActionClick = () => {
    if (isWebType && hero?.media?.src) {
      window.open(hero.media.src, "_blank", "noopener,noreferrer");
      return;
    }

    if (canPreview) {
      setShowPreviewModal(true);
      return;
    }

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
    const isLoggedIn = Boolean(user && user.id);

    if (isPaid && !isLoggedIn) {
      handleShowLoginModal();
    }
  };

  const modifiedPrimaryAction = primaryAction
    ? {
        ...primaryAction,
        onClick: handlePrimaryActionClick,
      }
    : undefined;

  const bodyPrimaryActions: SingleContentAction[] | undefined =
    primaryActions != null
      ? actionsWithPayment
      : modifiedPrimaryAction
        ? [modifiedPrimaryAction]
        : undefined;

  const { share } = useShare();
  const resolvedContentType = hero?.contentType ?? hero?.media?.type;
  const isPdfLayout =
    Boolean(resolvedContentType) && resolvedContentType !== FORMAT_TYPE.VIDEO;

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    router.back();
  };

  const handlePurchaseConfirm = async (couponCode?: string) => {
    if (!selectedAction || !contentId) return;

    try {
      const response = await createOrderMutation.mutateAsync({
        contentId,
        collectionId,
        itemType: selectedAction.isPurchase
          ? ORDER_TYPES.PURCHASE
          : ORDER_TYPES.RENTAL,
        ...(couponCode ? { couponCode } : {}),
      });
      const paymentUrl = response?.data?.url;
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
      {canPreview && (
        <ContentPreviewModal
          visible={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          src={hero.contentUrl || hero.media?.src || ""}
          type={hero.contentType || hero.media?.type || FORMAT_TYPE.VIDEO}
          title={title}
        />
      )}

      <PurchaseModal
        visible={showPurchaseModal}
        onClose={handleClosePurchaseModal}
        onPurchase={handlePurchaseConfirm}
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

      <GenericModal
        visible={isLoginModalVisible}
        onClose={handleCloseLoginModal}
        onCancel={handleLoginRedirect}
        onConfirm={handleCreateAccount}
        cancelLabel={t("createProfileHome.latestUpload.loginModal.cancelLabel")}
        confirmLabel={t(
          "createProfileHome.latestUpload.loginModal.confirmLabel",
        )}
        buttonRow
        buttonAlign={MODAL_ALIGN.CENTER}
        fullWidthButtons={false}
        size="md"
        spacing="start"
        showCloseButton
      >
        <ModalContentWrapper>
          <MonoText $use="Heading3">
            {t("createProfileHome.latestUpload.loginModal.title")}
          </MonoText>
          <ModalDescription $use="Body_Medium">
            {t("createProfileHome.latestUpload.loginModal.message")}
          </ModalDescription>
        </ModalContentWrapper>
      </GenericModal>
    </Wrapper>
  );
}
