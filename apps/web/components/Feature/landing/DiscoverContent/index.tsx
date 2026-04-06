"use client";

import Image from "next/image";
import { useTheme } from "styled-components";
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

  return (
    <Section>
      <HeaderSection>
        <Title>Discover content</Title>
        <Subtitle>
          Browse hundreds of videos, audio files, and e-books.
        </Subtitle>
      </HeaderSection>

      <GridContainer>
        {discoverContentData.map((item) => (
          <Card key={item.id}>
            <ImageContainer>
              <CategoryBadge>{item.category}</CategoryBadge>
              <Image
                src={item.image}
                alt={item.title}
                fill
                style={{ objectFit: "cover" }}
              />
            </ImageContainer>

            <TextSection>
              <CardTitle>{item.title}</CardTitle>
              <CardAuthor>{item.author}</CardAuthor>
              <CardDate>{item.date}</CardDate>

              <MediaTypeBox>
                <IconFrame>
                  {item.mediaType === "E-pub" ? (
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
                <MediaTypeText>{item.mediaType}</MediaTypeText>
              </MediaTypeBox>
            </TextSection>

            <ActionsContainer>
              {item.actions.map((action) =>
                action.fullWidth ? (
                  <FullWidthAction key={action.label}>
                    {action.label}
                  </FullWidthAction>
                ) : (
                  <ActionButton key={action.label}>{action.label}</ActionButton>
                ),
              )}
            </ActionsContainer>
          </Card>
        ))}
      </GridContainer>

      <BottomCtaSection>
        <PrimaryCtaButton>Join now</PrimaryCtaButton>
        <SecondaryCtaButton>View all creators</SecondaryCtaButton>
      </BottomCtaSection>
    </Section>
  );
}
