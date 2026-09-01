"use client";

import { memo, type MouseEvent } from "react";
import { useTheme } from "styled-components";
import { useTranslation } from "react-i18next";
import { EbookIcon, VideoIcon } from "@/assets/icons";
import { MEDIA_TYPE, STRING_EMPTY } from "@/utils/Constants";
import { pathPublishedContent } from "@/utils/path";
import { useProtectedContentNavigation } from "@/hooks/useProtectedContentNavigation";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import {
  MediaTypeBox,
  IconFrame,
  DiscoverContainer,
  CardTitle,
} from "./styles";
import GenericButton from "@/components/UI/GenericButton";
import { type DiscoverCardProps } from "@/utils/landingShared";
import { LANDING_IMAGE_DIMENSIONS } from "@/utils/landingUtils";
import GenericCard from "@/components/UI/GenericCard";

function DiscoverCard({ item }: DiscoverCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { navigateToContent } = useProtectedContentNavigation();
  const targetHref = pathPublishedContent(item.contentKey);

  const safeT = (key: string | undefined | null): string => {
    if (!key) return STRING_EMPTY;
    return t(key);
  };

  const handleOpen = () => {
    navigateToContent(targetHref, false);
  };

  const handleActionClick = (href: string) => {
    navigateToContent(href, false);
  };

  const stopCardNavigation = (event: MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <GenericCard
      coverImage
      imageAspectRatio="1 / 1"
      image={item.image}
      alt={safeT(item.titleKey)}
      badge={
        safeT(item.categoryKey) ? (
          <MonoText $use="Body_Bold" color={COLORS.neutral.GRAY}>
            {safeT(item.categoryKey)}
          </MonoText>
        ) : undefined
      }
      title={<CardTitle $use="Body_Medium">{safeT(item.titleKey)}</CardTitle>}
      subtitle={
        <MonoText $use="Body_Medium" color={COLORS.primary.BLACK_90}>
          {safeT(item.authorKey)}
        </MonoText>
      }
      onClick={handleOpen}
      footer={
        <DiscoverContainer onClick={stopCardNavigation}>
          {item.actions.map((action) => (
            <GenericButton
              key={action.labelKey}
              type="button"
              onClick={() => handleActionClick(action.href ?? targetHref)}
              style={{ flex: 1, minWidth: 0 }}
            >
              {safeT(action.labelKey)}
            </GenericButton>
          ))}
        </DiscoverContainer>
      }
    >
      <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY_400}>
        {safeT(item.dateKey)}
      </MonoText>

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
          {safeT(item.mediaTypeKey)}
        </MonoText>
      </MediaTypeBox>
    </GenericCard>
  );
}

export default memo(
  DiscoverCard,
  (prev: Readonly<DiscoverCardProps>, next: Readonly<DiscoverCardProps>) =>
    prev.item === next.item && prev.lng === next.lng,
);
