"use client";

import Image from "next/image";
import { memo, type MouseEvent } from "react";
import { useTheme } from "styled-components";
import { useTranslation } from "react-i18next";
import { EbookIcon, VideoIcon } from "@/assets/icons";
import { MEDIA_TYPE, VARIANT } from "@/utils/Constants";
import { pathPublishedContent } from "@/utils/path";
import { useProtectedContentNavigation } from "@/hooks/useProtectedContentNavigation";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import {
  Card,
  ImageContainer,
  CategoryBadge,
  TextSection,
  CardTitle,
  CardAuthor,
  CardDate,
  MediaTypeBox,
  ActionsContainer,
  SingleActionButton,
  IconFrame,
  discoverCardRevealStyle,
  discoverCardImageStyle,
} from "./styles";
import ImageReveal from "@/components/UI/ImageReveal";
import GenericButton from "@/components/UI/GenericButton";
import { type DiscoverCardProps } from "@/utils/landingShared";
import { LANDING_REVEAL } from "@/utils/landingUtils";
import { IMAGE_SIZES } from "@/utils/landingShared";
import {
  LANDING_IMAGE_DIMENSIONS,
  LANDING_IMAGE_FLAGS,
  LANDING_REVEAL_VARIANTS,
} from "@/utils/landingUtils";
function DiscoverCard({ item }: DiscoverCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { navigateToContent } = useProtectedContentNavigation();
  const targetHref = pathPublishedContent(item.contentKey);
  const isFreeContent = item.isFree ?? false;

  const handleOpen = () => {
    navigateToContent(targetHref, false);
  };

  const handleActionClick = (href: string, requiresAuth?: boolean) => {
    navigateToContent(href, requiresAuth ?? !isFreeContent);
  };

  const stopCardNavigation = (event: MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <Card aria-label={t(item.titleKey)} onClick={handleOpen} $clickable={true}>
      <ImageContainer>
        <CategoryBadge>
          <MonoText $use="Body_Bold" color={COLORS.primary.BLACK_90}>
            {t(item.categoryKey)}
          </MonoText>
        </CategoryBadge>
        <ImageReveal
          variant={LANDING_REVEAL_VARIANTS.fadeScale}
          duration={LANDING_REVEAL.revealDuration}
          style={discoverCardRevealStyle}
        >
          <Image
            src={item.image}
            alt={t(item.titleKey)}
            fill={LANDING_IMAGE_FLAGS.fill}
            sizes={IMAGE_SIZES.discoverCard}
            style={discoverCardImageStyle}
            priority={LANDING_IMAGE_FLAGS.priority}
          />
        </ImageReveal>
      </ImageContainer>

      <TextSection>
        <CardTitle>
          <MonoText $use="H5_Medium">{t(item.titleKey)}</MonoText>
        </CardTitle>
        <CardAuthor>
          <MonoText $use="Body_Medium" color={COLORS.primary.BLACK_90}>
            {t(item.authorKey)}
          </MonoText>
        </CardAuthor>
        <CardDate>
          <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY_400}>
            {t(item.dateKey)}
          </MonoText>
        </CardDate>

        <MediaTypeBox>
          <IconFrame>
            {item.mediaType === MEDIA_TYPE.EPUB ? (
              <EbookIcon
                width={LANDING_IMAGE_DIMENSIONS.discoverMediaIcon.width}
                height={LANDING_IMAGE_DIMENSIONS.discoverMediaIcon.height}
                color={theme.colors.neutral.BLACK}
              />
            ) : (
              <VideoIcon color={theme.colors.neutral.BLACK} />
            )}
          </IconFrame>
          <MonoText $use="Body_Bold" color={COLORS.primary.BLACK_90}>
            {t(item.mediaTypeKey)}
          </MonoText>
        </MediaTypeBox>
      </TextSection>

      <ActionsContainer onClick={stopCardNavigation}>
        {item.actions.length === 1 ? (
          <SingleActionButton
            key={item.actions[0].labelKey}
            type="button"
            onClick={() =>
              handleActionClick(
                item.actions[0].href ?? targetHref,
                item.actions[0].requiresAuth,
              )
            }
          >
            {t(item.actions[0].labelKey)}
          </SingleActionButton>
        ) : (
          item.actions.map((action) => (
            <GenericButton
              key={action.labelKey}
              type="button"
              variant={VARIANT.SOFT_OUTLINE}
              onClick={() =>
                handleActionClick(
                  action.href ?? targetHref,
                  action.requiresAuth,
                )
              }
            >
              {t(action.labelKey)}
            </GenericButton>
          ))
        )}
      </ActionsContainer>
    </Card>
  );
}

export default memo(
  DiscoverCard,
  (prev: Readonly<DiscoverCardProps>, next: Readonly<DiscoverCardProps>) =>
    prev.item === next.item && prev.lng === next.lng,
);
