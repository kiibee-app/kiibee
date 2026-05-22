"use client";

import Image from "next/image";
import { memo } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "styled-components";
import { useTranslation } from "react-i18next";
import { EbookIcon, VideoIcon } from "@/assets/icons";
import { MEDIA_TYPE } from "@/utils/Constants";
import { pathPublishedContent } from "@/utils/path";
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
  ActionButton,
  FullWidthAction,
  IconFrame,
  discoverCardRevealStyle,
  discoverCardImageStyle,
} from "./styles";
import ImageReveal from "@/components/UI/ImageReveal";
import { type DiscoverCardProps } from "@/types/discoverCard";
import { LANDING_REVEAL } from "@/utils/landingReveal";
import { IMAGE_SIZES } from "@/utils/imageSizes";
import {
  LANDING_IMAGE_DIMENSIONS,
  LANDING_IMAGE_FLAGS,
  LANDING_REVEAL_VARIANTS,
} from "@/utils/landingConfig";
function DiscoverCard({ item }: DiscoverCardProps) {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const targetHref = pathPublishedContent(item.contentKey);

  const handleOpen = () => {
    router.push(targetHref);
  };

  return (
    <Card aria-label={t(item.titleKey)} onClick={handleOpen}>
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

      <ActionsContainer>
        {item.actions.map((action) =>
          action.fullWidth ? (
            <FullWidthAction key={action.labelKey} type="button">
              {t(action.labelKey)}
            </FullWidthAction>
          ) : (
            <ActionButton key={action.labelKey} type="button">
              {t(action.labelKey)}
            </ActionButton>
          ),
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
