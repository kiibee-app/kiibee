"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import type { ImageSource } from "@/utils/Constants";
import {
  ReadMoreButton,
  ActionButtons,
  ActionMainText,
  ActionSubText,
  Section,
  ContentWrapper,
  ImageSection,
  TextSection,
  Title,
  Paragraph,
  Badge,
  ImageOverlay,
  BottomControls,
  UploadImage,
  RightControlButton,
  LeftControlButton,
  ModalContentWrapper,
  ModalDescription,
} from "./styles";
import { resolveImageUrl, MOBILE_BREAKPOINT, VARIANT } from "@/utils/Constants";
import { MonoText } from "@/components/UI/Monotext";
import {
  EpubIcon,
  PdfIcon,
  PlayCircleIcon,
  PlayIcon,
  WebIcon,
} from "@/assets/icons";
import { useIsMobile } from "@/utils/useIsMobile";
import { GenericModal } from "@/components/UI/Modals";
import { PATHS, pathPublishedContent } from "@/utils/path";
import { MODAL_ALIGN } from "@/utils/ui";
import { ContentType, normalizeContentTypeValue } from "@/utils/content";
import { FORMAT_TYPE } from "@/utils/types";
import {
  formatPriceLabel,
  getContentDetailPricingActions,
  getPricingLabels,
  isBuyActionLabel,
  isFreeContentItem,
  resolveContentActionHref,
} from "@/utils/contentPricingActions";
import { authStorage } from "@/lib/auth/authStorage";
import { useProtectedContentNavigation } from "@/hooks/useProtectedContentNavigation";
import { ROLE_CREATOR } from "@/utils/Constants";

type LatestUploadAction = {
  title: string;
  subtitle?: string;
};

export type LatestUploadData = {
  contentType?: ContentType;
  sectionTitle: string;
  badge: string;
  image: ImageSource;
  imageAlt: string;
  title: string;
  year: string;
  description: string;
  actions: [LatestUploadAction, LatestUploadAction?];
  contentId?: string;
  accessType?: string | null;
  buyPrice?: string | number | null;
  rentPrice?: string | number | null;
  rentDurationHours?: string | number | null;
  imageStyle?: {
    width?: string;
    height?: string;
    padding?: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    gap?: string;
  };
  containerStyle?: {
    padding?: string;
    maxWidth?: string;
  };
};

type LatestUploadProps = {
  data: LatestUploadData;
};

const contentIconMap = {
  video: PlayCircleIcon,
  audio: PlayCircleIcon,
  pdf: PdfIcon,
  epub: EpubIcon,
  web: WebIcon,
} as const;

type ComputedAction = {
  title: string;
  subtitle?: string;
  href?: string;
};

export default function LatestUpload({ data }: LatestUploadProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const isMobile = useIsMobile(MOBILE_BREAKPOINT);
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const { navigateToContent } = useProtectedContentNavigation();
  const storedUser = useStoredLoginUser();
  const isCreator = storedUser?.role === ROLE_CREATOR;

  const computedActions = useMemo((): ComputedAction[] => {
    if (data.contentId) {
      const pricingItem = {
        accessType: data.accessType,
        buyPrice: data.buyPrice,
        rentPrice: data.rentPrice,
        rentDurationHours: data.rentDurationHours,
      };

      if (isFreeContentItem(pricingItem)) {
        return [
          {
            title: t("pricingLabels.free"),
            subtitle: t("singleContent.pricing.downloadFiles"),
            href: `${pathPublishedContent(data.contentId)}#buy`,
          },
          {
            title: t("createProfileHome.latestUpload.seeContent"),
            href: pathPublishedContent(data.contentId),
          },
        ];
      }

      const pricingActions = getContentDetailPricingActions(pricingItem, t, {
        labels: getPricingLabels(t),
      });

      return pricingActions.map((action) => ({
        title: action.label,
        subtitle: action.subtitle,
        href: resolveContentActionHref(
          data.contentId!,
          action.label,
          pricingItem,
          pricingActions.length,
          { labels: getPricingLabels(t) },
        ),
      }));
    }

    const fallbackActions = data.actions[0]
      ? [data.actions[0], data.actions[1]].filter(
          (a): a is NonNullable<typeof a> => Boolean(a),
        )
      : [];
    return fallbackActions.map((action) => ({
      title: action.title,
      subtitle: action.subtitle,
      href: undefined as string | undefined,
    }));
  }, [data, t]);

  const visibleActions = useMemo(() => {
    if (!isCreator) return computedActions;
    return computedActions.filter((action) => !action.href?.includes("#buy"));
  }, [computedActions, isCreator]);

  const [primaryAction, secondaryAction] = visibleActions;
  const handleLogin = () => {
    const next = encodeURIComponent(
      window.location.pathname + window.location.search,
    );
    router.push(`${PATHS.AUTH_LOGIN}?next=${next}`);
  };
  const handleCreateAccount = () => router.push(PATHS.AUTH_SIGNUP);
  const handleSecondaryActionClick = () => {
    if (secondaryAction?.href) {
      navigateToContent(secondaryAction.href, true);
    }
  };
  const handlePrimaryActionClick = () => {
    if (!primaryAction.href) {
      setLoginModalVisible(true);
      return;
    }

    if (isBuyActionLabel(primaryAction.title) && !authStorage.hasSession()) {
      setLoginModalVisible(true);
      return;
    }

    navigateToContent(primaryAction.href, true);
  };
  const normalizedContentType = normalizeContentTypeValue(
    String((data as { contentType?: unknown }).contentType ?? ""),
  );
  const isMediaPlayable =
    normalizedContentType === FORMAT_TYPE.VIDEO ||
    normalizedContentType === FORMAT_TYPE.AUDIO;
  const TypeIcon = contentIconMap[normalizedContentType];

  return (
    <Section
      $padding={data.containerStyle?.padding}
      $maxWidth={data.containerStyle?.maxWidth}
    >
      <MonoText $use="H4_Medium">{data.sectionTitle}</MonoText>

      <ContentWrapper $isMobile={isMobile}>
        <ImageSection
          $width={data.imageStyle?.width}
          $height={data.imageStyle?.height}
          $padding={data.imageStyle?.padding}
          $flexDirection={data.imageStyle?.flexDirection}
          $justifyContent={data.imageStyle?.justifyContent}
          $alignItems={data.imageStyle?.alignItems}
          $gap={data.imageStyle?.gap}
        >
          <Badge>{data.badge}</Badge>

          <UploadImage src={resolveImageUrl(data.image)} alt={data.imageAlt} />

          <ImageOverlay>
            <BottomControls>
              {isMediaPlayable ? (
                <>
                  <LeftControlButton>
                    <PlayCircleIcon />
                    {t("createProfileHome.latestUpload.video")}
                  </LeftControlButton>

                  <RightControlButton>
                    <PlayIcon width={24} height={24} />
                    {t("createProfileHome.latestUpload.playTrailer")}
                  </RightControlButton>
                </>
              ) : (
                <>
                  <LeftControlButton>
                    <TypeIcon />
                    {t(
                      `contents.contentTypeModal.options.${normalizedContentType}`,
                    )}
                  </LeftControlButton>
                </>
              )}
            </BottomControls>
          </ImageOverlay>
        </ImageSection>

        <TextSection>
          <Title>{data.title}</Title>
          <Paragraph>{data.description}</Paragraph>

          {primaryAction ? (
            <ActionButtons>
              <ReadMoreButton
                type="button"
                onClick={handlePrimaryActionClick}
                $tone={secondaryAction ? VARIANT.PRIMARY : VARIANT.SECONDARY}
              >
                <ActionMainText
                  $tone={secondaryAction ? VARIANT.PRIMARY : VARIANT.SECONDARY}
                >
                  {primaryAction.title}
                </ActionMainText>
                {primaryAction.subtitle ? (
                  <ActionSubText
                    $tone={
                      secondaryAction ? VARIANT.PRIMARY : VARIANT.SECONDARY
                    }
                  >
                    {primaryAction.subtitle}
                  </ActionSubText>
                ) : null}
              </ReadMoreButton>

              {secondaryAction ? (
                <ReadMoreButton
                  type="button"
                  onClick={handleSecondaryActionClick}
                  $tone={VARIANT.SECONDARY}
                >
                  <ActionMainText $tone={VARIANT.SECONDARY}>
                    {secondaryAction.title}
                  </ActionMainText>
                  {secondaryAction.subtitle ? (
                    <ActionSubText $tone={VARIANT.SECONDARY}>
                      {secondaryAction.subtitle}
                    </ActionSubText>
                  ) : null}
                </ReadMoreButton>
              ) : null}
            </ActionButtons>
          ) : null}
        </TextSection>
      </ContentWrapper>

      <GenericModal
        visible={isLoginModalVisible}
        onClose={() => setLoginModalVisible(false)}
        onCancel={handleLogin}
        onConfirm={handleCreateAccount}
        cancelLabel={t("createProfileHome.latestUpload.loginModal.cancelLabel")}
        confirmLabel={t(
          "createProfileHome.latestUpload.loginModal.confirmLabel",
        )}
        buttonRow
        buttonAlign={MODAL_ALIGN.CENTER}
        fullWidthButtons={false}
        size="sm"
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
    </Section>
  );
}
