"use client";

import Image from "next/image";
import { useTheme } from "styled-components";
import { useTranslation } from "react-i18next";
import { BookIcon, PlayIcon } from "@/assets/icons";
import { discoverContentData } from "@/utils/discoverContent";
import {
  Section,
  HeaderSection,
  Title,
  Subtitle,
  GridContainer,
  Card,
  ImageContainer,
  CategoryBadge,
  TextSection,
  CardTitle,
  CardAuthor,
  CardDate,
  MediaTypeBox,
  MediaTypeText,
  ActionsContainer,
  ActionButton,
  FullWidthAction,
  BottomCtaSection,
  PrimaryCtaButton,
  SecondaryCtaButton,
  IconFrame,
} from "./styles";

export default function DiscoverContent() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Section>
      <HeaderSection>
        <Title>{t("discoverContent.title")}</Title>
        <Subtitle>{t("discoverContent.subtitle")}</Subtitle>
      </HeaderSection>

      <GridContainer>
        {discoverContentData.map((item) => (
          <Card key={item.id}>
            <ImageContainer>
              <CategoryBadge>{t(item.categoryKey)}</CategoryBadge>
              <Image
                src={item.image}
                alt={t(item.titleKey)}
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
              />
            </ImageContainer>

            <TextSection>
              <CardTitle>{t(item.titleKey)}</CardTitle>
              <CardAuthor>{t(item.authorKey)}</CardAuthor>
              <CardDate>{t(item.dateKey)}</CardDate>

              <MediaTypeBox>
                <IconFrame>
                  {item.mediaType === "epub" ? (
                    <BookIcon
                      bg={theme.colors.neutral.BLACK}
                      fg={theme.colors.neutral.WHITE}
                    />
                  ) : (
                    <PlayIcon
                      bg={theme.colors.neutral.BLACK}
                      fg={theme.colors.neutral.WHITE}
                    />
                  )}
                </IconFrame>
                <MediaTypeText>{t(item.mediaTypeKey)}</MediaTypeText>
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
        ))}
      </GridContainer>

      <BottomCtaSection>
        <PrimaryCtaButton>{t("discoverContent.ctaPrimary")}</PrimaryCtaButton>
        <SecondaryCtaButton>
          {t("discoverContent.ctaSecondary")}
        </SecondaryCtaButton>
      </BottomCtaSection>
    </Section>
  );
}
