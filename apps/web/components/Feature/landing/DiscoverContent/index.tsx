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
  ActionsContainer,
  ActionButton,
  FullWidthAction,
  BottomCtaSection,
  IconFrame,
} from "./styles";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import GenericButton from "@/components/UI/GenericButton";

export default function DiscoverContent() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Section>
      <HeaderSection>
        <Title>
          <MonoText $use="Heading2">{t("discoverContent.title")}</MonoText>
        </Title>
        <Subtitle>
          <MonoText $use="H4_Medium">{t("discoverContent.subtitle")}</MonoText>
        </Subtitle>
      </HeaderSection>

      <GridContainer>
        {discoverContentData.map((item) => (
          <Card key={item.id}>
            <ImageContainer>
              <CategoryBadge>
                <MonoText
                  $use="Body_Bold"
                  color={COLORS.primary.BLACK_90}
                ></MonoText>
              </CategoryBadge>
              <Image
                src={item.image}
                alt={t(item.titleKey)}
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
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
        ))}
      </GridContainer>

      <BottomCtaSection>
        <GenericButton>{t("discoverContent.ctaPrimary")}</GenericButton>
        <GenericButton variant="secondary">
          {t("discoverContent.ctaSecondary")}
        </GenericButton>
      </BottomCtaSection>
    </Section>
  );
}
