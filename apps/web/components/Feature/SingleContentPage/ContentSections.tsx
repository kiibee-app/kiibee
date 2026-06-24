"use client";

import Link from "next/link";
import BackButtonIcon from "@/assets/icons/BackButtonIcon";
import { ShareIcon } from "@/assets/icons/shareIcon";
import CreatorChannelAvatar from "@/components/Feature/ProfileLayout/shared/CreatorChannelAvatar";
import type {
  SingleContentBodyProps,
  SingleContentCreatorProps,
  SingleContentHeroProps,
  SingleContentTopBarProps,
} from "@/types/contentTypes";
import GenericButton from "@/components/UI/GenericButton";
import { MonoText } from "@/components/UI/Monotext";
import {
  CREATOR,
  CREATOR_CHANNEL_AVATAR_TEXT,
  isString,
  VARIANT,
} from "@/utils/Constants";
import { getPublicCreatorProfilePath } from "@/utils/creatorChannel";
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
  PricingCtaContent,
  PricingCtaRow,
  PricingCtaSubtext,
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
  const initial = creator.name.trim().charAt(0).toUpperCase() || CREATOR[0];
  const content = (
    <>
      <CreatorAvatar>
        <CreatorChannelAvatar
          avatarUrl={isString(creator.avatar) ? creator.avatar : null}
          initial={initial}
          alt={creator.avatarAlt ?? creator.name}
          sizes="30px"
          initialUse={CREATOR_CHANNEL_AVATAR_TEXT.COMPACT}
        />
      </CreatorAvatar>
      <CreatorName>{creator.name}</CreatorName>
    </>
  );

  if (creator.id) {
    return (
      <CreatorRow as={Link} href={getPublicCreatorProfilePath(creator.id)}>
        {content}
      </CreatorRow>
    );
  }

  return <CreatorRow>{content}</CreatorRow>;
}

export function SingleContentBody({
  creator,
  statusLabel,
  title,
  descriptions,
  tags,
  primaryAction,
  primaryActions,
  expiry,
  metaItems,
  accessGate,
}: SingleContentBodyProps) {
  const safeDescriptions = descriptions ?? [];
  const safeTags = tags ?? [];
  const safeMeta = metaItems ?? [];
  const actions = primaryActions ?? (primaryAction ? [primaryAction] : []);

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

      {accessGate ? (
        accessGate
      ) : (
        <>
          {actions.length === 1 ? (
            <MainAction
              onClick={actions[0].onClick}
              type="button"
              disabled={actions[0].disabled}
              aria-label={actions[0].ariaLabel ?? actions[0].label}
            >
              <MainActionText>{actions[0].label}</MainActionText>
            </MainAction>
          ) : null}

          {actions.length > 1 ? (
            <PricingCtaRow>
              {actions.map((action) => {
                const variant = action.variant ?? VARIANT.SOFT_OUTLINE;
                const isPrimary = variant === VARIANT.PRIMARY;

                return (
                  <GenericButton
                    key={action.label}
                    type="button"
                    variant={variant}
                    size="lg"
                    minWidth="160px"
                    className="pricing-cta"
                    onClick={action.onClick}
                    disabled={action.disabled}
                    aria-label={action.ariaLabel ?? action.label}
                  >
                    {action.subtitle ? (
                      <PricingCtaContent>
                        <MonoText $use="Body_Medium" color="inherit">
                          {action.label}
                        </MonoText>
                        <PricingCtaSubtext $isPrimary={isPrimary}>
                          {action.subtitle}
                        </PricingCtaSubtext>
                      </PricingCtaContent>
                    ) : (
                      action.label
                    )}
                  </GenericButton>
                );
              })}
            </PricingCtaRow>
          ) : null}
        </>
      )}

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
