"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import BackButtonIcon from "@/assets/icons/BackButtonIcon";
import { ShareIcon } from "@/assets/icons/shareIcon";
import type { ImageSource } from "@/utils/Constants";
import {
  BackButton,
  Card,
  ContentShell,
  CreatorAvatar,
  CreatorName,
  CreatorRow,
  DescriptionText,
  BodyTextWrap,
  ExpiryText,
  HeadingBlock,
  Hero,
  HeroTag,
  HeroTagText,
  HeroMediaTag,
  HeroMediaText,
  InfoTag,
  InfoTagText,
  MainAction,
  MainActionText,
  MainTitle,
  MetaKey,
  MetaLabelText,
  MetaRow,
  MetaSection,
  MetaValueText,
  Preview,
  ShareButton,
  ShareText,
  StatusBadge,
  TagRow,
  TopBar,
  TrailerButton,
  TrailerText,
  Wrapper,
} from "./styles";

export type SingleContentMetaItem = {
  label: string;
  value: ReactNode;
};

export type SingleContentPageProps = {
  title: string;
  descriptions?: string[];
  tags?: string[];
  statusLabel?: string;
  expiry?: {
    label: string;
    tone?: "default" | "urgent";
  };
  creator?: {
    name: string;
    avatar?: ImageSource;
    avatarAlt?: string;
  };
  hero: {
    image: ImageSource;
    imageAlt: string;
    categoryLabel?: string;
    mediaLabel?: string;
    mediaIcon?: ImageSource;
    mediaIconAlt?: string;
    trailerLabel?: string;
    trailerIcon?: ImageSource;
    trailerIconAlt?: string;
    onTrailerClick?: () => void;
  };
  primaryAction?: {
    label: string;
    ariaLabel?: string;
    onClick?: () => void;
  };
  metaItems?: SingleContentMetaItem[];
  shareLabel?: string;
  showShare?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  onShare?: () => void;
  children?: ReactNode;
};

export default function SingleContentPage({
  title,
  descriptions = [],
  tags = [],
  statusLabel,
  expiry,
  creator,
  hero,
  primaryAction,
  metaItems = [],
  shareLabel = "Share",
  showShare = true,
  showBack = true,
  onBack,
  onShare,
  children,
}: SingleContentPageProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    router.back();
  };

  return (
    <Wrapper>
      <Card>
        <TopBar>
          {showBack ? (
            <BackButton onClick={handleBack} aria-label="Go back" type="button">
              <BackButtonIcon />
            </BackButton>
          ) : (
            <span />
          )}

          {showShare ? (
            <ShareButton onClick={onShare} type="button">
              <ShareIcon width={16} height={16} />
              <ShareText>{shareLabel}</ShareText>
            </ShareButton>
          ) : null}
        </TopBar>

        <Hero>
          <Preview>
            <Image src={hero.image} alt={hero.imageAlt} fill priority />
          </Preview>

          {hero.categoryLabel ? (
            <HeroTag>
              <HeroTagText>{hero.categoryLabel}</HeroTagText>
            </HeroTag>
          ) : null}

          {hero.mediaLabel ? (
            <HeroMediaTag>
              {hero.mediaIcon ? (
                <Image
                  src={hero.mediaIcon}
                  alt={hero.mediaIconAlt ?? ""}
                  width={16}
                  height={16}
                  priority
                />
              ) : null}
              <HeroMediaText>{hero.mediaLabel}</HeroMediaText>
            </HeroMediaTag>
          ) : null}

          {hero.trailerLabel ? (
            <TrailerButton onClick={hero.onTrailerClick} type="button">
              {hero.trailerIcon ? (
                <Image
                  src={hero.trailerIcon}
                  alt={hero.trailerIconAlt ?? ""}
                  width={15}
                  height={15}
                  priority
                />
              ) : null}
              <TrailerText>{hero.trailerLabel}</TrailerText>
            </TrailerButton>
          ) : null}
        </Hero>

        <ContentShell>
          {creator ? (
            <CreatorRow>
              {creator.avatar ? (
                <CreatorAvatar>
                  <Image
                    src={creator.avatar}
                    alt={creator.avatarAlt ?? creator.name}
                    fill
                    priority
                  />
                </CreatorAvatar>
              ) : null}
              <CreatorName>{creator.name}</CreatorName>
            </CreatorRow>
          ) : null}

          <HeadingBlock>
            {statusLabel ? <StatusBadge>{statusLabel}</StatusBadge> : null}
            <MainTitle>{title}</MainTitle>

            {descriptions.length ? (
              <BodyTextWrap>
                {descriptions.map((description) => (
                  <DescriptionText key={description}>
                    {description}
                  </DescriptionText>
                ))}
              </BodyTextWrap>
            ) : null}
          </HeadingBlock>

          {tags.length ? (
            <TagRow>
              {tags.map((tag) => (
                <InfoTag key={tag}>
                  <InfoTagText>{tag}</InfoTagText>
                </InfoTag>
              ))}
            </TagRow>
          ) : null}

          {primaryAction ? (
            <MainAction
              onClick={primaryAction.onClick}
              type="button"
              aria-label={primaryAction.ariaLabel}
            >
              <MainActionText>{primaryAction.label}</MainActionText>
            </MainAction>
          ) : null}

          {expiry ? (
            <ExpiryText $tone={expiry.tone}>{expiry.label}</ExpiryText>
          ) : null}

          {metaItems.length ? (
            <MetaSection>
              {metaItems.map((item) => (
                <MetaRow key={item.label}>
                  <MetaKey>
                    <MetaLabelText>{item.label}</MetaLabelText>
                  </MetaKey>
                  <MetaValueText>{item.value}</MetaValueText>
                </MetaRow>
              ))}
            </MetaSection>
          ) : null}
        </ContentShell>
      </Card>

      {children}
    </Wrapper>
  );
}
