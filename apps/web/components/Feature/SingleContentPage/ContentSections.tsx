"use client";

import Image from "next/image";
import BackButtonIcon from "@/assets/icons/BackButtonIcon";
import { ShareIcon } from "@/assets/icons/shareIcon";
import type {
  SingleContentBodyProps,
  SingleContentCreatorProps,
  SingleContentHeroProps,
  SingleContentTopBarProps,
} from "@/types/contentTypes";
import {
  BackButton,
  BodyTextWrap,
  ContentShell,
  CreatorAvatar,
  CreatorName,
  CreatorRow,
  DescriptionText,
  ExpiryText,
  HeadingBlock,
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
  ShareButton,
  ShareText,
  StatusBadge,
  TagRow,
  TopBar,
} from "./styles";
import { t } from "i18next";
import { resolveImageUrl } from "@/utils/media";
import SingleContentHeroView from "./SingleContentHeroView";

export function SingleContentTopBar({
  showBack,
  showShare,
  shareLabel,
  onBackClick,
  onShare,
}: SingleContentTopBarProps) {
  return (
    <TopBar>
      {showBack ? (
        <BackButton
          onClick={onBackClick}
          aria-label={t("common.goBack")}
          type="button"
        >
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
  );
}

export function SingleContentHero({
  hero,
  isPdfLayout = false,
}: {
  hero: SingleContentHeroProps;
  isPdfLayout?: boolean;
}) {
  const heroKey = hero.media?.src ?? resolveImageUrl(hero.image);

  return (
    <SingleContentHeroView
      key={heroKey}
      hero={hero}
      isPdfLayout={isPdfLayout}
    />
  );
}

function SingleContentCreator({ creator }: SingleContentCreatorProps) {
  return (
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
  );
}

export function SingleContentBody({
  creator,
  statusLabel,
  title,
  descriptions,
  tags,
  primaryAction,
  expiry,
  metaItems,
}: SingleContentBodyProps) {
  const safeDescriptions = descriptions ?? [];
  const safeTags = tags ?? [];
  const safeMeta = metaItems ?? [];

  return (
    <ContentShell>
      {creator ? <SingleContentCreator creator={creator} /> : null}

      <HeadingBlock>
        {statusLabel ? <StatusBadge>{statusLabel}</StatusBadge> : null}
        <MainTitle>{title}</MainTitle>

        {safeDescriptions.length ? (
          <BodyTextWrap>
            {safeDescriptions.map((description) => (
              <DescriptionText key={description}>{description}</DescriptionText>
            ))}
          </BodyTextWrap>
        ) : null}
      </HeadingBlock>

      {safeTags.length ? (
        <TagRow>
          {safeTags.map((tag) => (
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
          disabled={primaryAction.disabled}
          aria-label={primaryAction.ariaLabel}
        >
          <MainActionText>{primaryAction.label}</MainActionText>
        </MainAction>
      ) : null}

      {expiry ? (
        <ExpiryText $tone={expiry.tone}>{expiry.label}</ExpiryText>
      ) : null}

      {safeMeta.length ? (
        <MetaSection>
          {safeMeta.map((item, index) => (
            <MetaRow key={item.label}>
              <MetaKey>
                <MetaLabelText>{item.label}</MetaLabelText>
              </MetaKey>
              <MetaValueText $strong={index === 1}>{item.value}</MetaValueText>
            </MetaRow>
          ))}
        </MetaSection>
      ) : null}
    </ContentShell>
  );
}
