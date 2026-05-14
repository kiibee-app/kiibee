"use client";

import Image from "next/image";
import { memo } from "react";
import { useTheme } from "styled-components";
import { useTranslation } from "react-i18next";
import { EbookIcon, VideoIcon } from "@/assets/icons";
import { MEDIA_TYPE } from "@/utils/Constants";
import type { DiscoverContentItem } from "@/utils/discoverContent";
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
} from "./styles";

type Props = {
  item: DiscoverContentItem;
  lng?: string;
};

function DiscoverCard({ item }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Card>
      <ImageContainer>
        <CategoryBadge>
          <MonoText $use="Body_Bold" color={COLORS.primary.BLACK_90}>
            {t(item.categoryKey)}
          </MonoText>
        </CategoryBadge>
        <Image
          src={item.image}
          alt={t(item.titleKey)}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
          priority
        />
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
                width={24}
                height={24}
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
            <FullWidthAction key={action.labelKey}>
              {t(action.labelKey)}
            </FullWidthAction>
          ) : (
            <ActionButton key={action.labelKey}>
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
  (prev: Readonly<Props>, next: Readonly<Props>) =>
    prev.item === next.item && prev.lng === next.lng,
);
