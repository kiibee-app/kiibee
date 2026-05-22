"use client";

import Image from "next/image";
import { memo } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "styled-components";
import { useTranslation } from "react-i18next";
import { EbookIcon, VideoIcon } from "@/assets/icons";
import { MEDIA_TYPE } from "@/utils/Constants";
import type { DiscoverContentItem } from "@/utils/discoverContent";
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
} from "./styles";
import ImageReveal from "@/components/UI/ImageReveal";

type Props = {
  item: DiscoverContentItem;
  lng?: string;
};

function DiscoverCard({ item }: Props) {
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
          variant="fade-scale"
          duration={1.2}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <Image
            src={item.image}
            alt={t(item.titleKey)}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            priority
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
  (prev: Readonly<Props>, next: Readonly<Props>) =>
    prev.item === next.item && prev.lng === next.lng,
);
