"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
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

export type {
  SingleContentHeroProps,
  SingleContentMetaItem,
  SingleContentPageProps,
} from "@/types/contentTypes";

export default function SingleContentPage(props: SingleContentPageProps) {
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
            router.push(PATHS.AUTH_LOGIN);
            return;
          }

          try {
            const response = await createOrderMutation.mutateAsync({
              contentId,
              collectionId,
              itemType: isPurchase ? ORDER_TYPES.PURCHASE : ORDER_TYPES.RENTAL,
            });
            const paymentUrl = response?.data?.url;
            if (!paymentUrl) {
              throw new Error("Payment URL missing");
            }
            window.location.assign(paymentUrl);
          } catch (error) {
            const message = getErrorMessage(error, "errors.saveChangesFailed");
            toast.error(message);
          }
        },
      };
    });
  }, [
    collectionId,
    contentId,
    createOrderMutation,
    getErrorMessage,
    primaryAction,
    primaryActions,
    router,
    user?.id,
  ]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

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
      router.push(PATHS.AUTH_LOGIN);
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
  const isPdfLayout =
    hero?.media?.type === FORMAT_TYPE.PDF ||
    hero?.media?.type === FORMAT_TYPE.EPUB;

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    router.back();
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
    </Wrapper>
  );
}
