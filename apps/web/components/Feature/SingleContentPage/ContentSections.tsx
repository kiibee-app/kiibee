import Image from "next/image";
import BackButtonIcon from "@/assets/icons/BackButtonIcon";
import { ShareIcon } from "@/assets/icons/shareIcon";
import type {
  SingleContentBodyProps,
  SingleContentCreatorProps,
  SingleContentHeroSectionProps,
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
  Hero,
  HeroMediaTag,
  HeroMediaText,
  HeroTag,
  HeroTagText,
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
} from "./styles";
import { t } from "i18next";

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

export function SingleContentHero({ hero }: SingleContentHeroSectionProps) {
  return (
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
          {safeMeta.map((item) => (
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
  );
}
