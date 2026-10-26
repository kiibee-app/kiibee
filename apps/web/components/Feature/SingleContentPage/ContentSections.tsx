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
  SingleContentAction,
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
  MainActionExpiryText,
  MainActionRow,
  MainActionText,
  MainTitle,
  MetaKey,
  MetaLabelText,
  MetaRow,
  MetaSection,
  MetaValueText,
  PhysicalProductLinkAnchor,
  PhysicalProductLinkRow,
  PricingCtaContent,
  PricingCtaRow,
  PricingCtaSubtext,
  ShareButton,
  ShareText,
  StatusBadge,
  TagRow,
  TopBar,
} from "./styles";
import { useTranslation } from "react-i18next";
import { resolveImageUrl } from "@/utils/media";
import LinkIcon from "@/assets/icons/LinkIcon";
import { normalizeExternalUrl } from "@/utils/common";
import SingleContentHeroView from "./SingleContentHeroView";

export function SingleContentTopBar({
  showBack,
  showShare,
  shareLabel,
  onBackClick,
  onShare,
  embedded = false,
}: SingleContentTopBarProps & { embedded?: boolean }) {
  const { t } = useTranslation();

  return (
    <TopBar $embedded={embedded}>
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
  primaryAction,
}: {
  hero: SingleContentHeroProps;
  isPdfLayout?: boolean;
  primaryAction?: SingleContentAction;
}) {
  const heroKey = hero.media?.src ?? resolveImageUrl(hero.image);

  return (
    <SingleContentHeroView
      key={heroKey}
      hero={hero}
      isPdfLayout={isPdfLayout}
      primaryAction={primaryAction}
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
          fit="contain"
        />
      </CreatorAvatar>
      <CreatorName>{creator.name}</CreatorName>
    </>
  );

  if (creator.slug) {
    return (
      <CreatorRow as={Link} href={getPublicCreatorProfilePath(creator.slug)}>
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
  physicalProductLink,
  accessGate,
}: SingleContentBodyProps) {
  const { t } = useTranslation();
  const safeDescriptions = descriptions ?? [];
  const safeTags = Array.from(new Set(tags ?? []));
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
            {safeDescriptions.map((description, index) => (
              <DescriptionText key={`${index}-${description}`}>
                {description}
              </DescriptionText>
            ))}
          </BodyTextWrap>
        ) : null}
      </HeadingBlock>

      {safeTags.length ? (
        <TagRow>
          {safeTags.map((tag, index) => (
            <InfoTag key={`${index}-${tag}`}>
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
            <MainActionRow>
              <MainAction
                onClick={actions[0].onClick}
                type="button"
                disabled={actions[0].disabled}
                aria-label={actions[0].ariaLabel ?? actions[0].label}
              >
                <MainActionText>{actions[0].label}</MainActionText>
              </MainAction>
              {expiry ? (
                <MainActionExpiryText>{expiry.label}</MainActionExpiryText>
              ) : null}
            </MainActionRow>
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

      {expiry && actions.length !== 1 ? (
        <ExpiryText $tone={expiry.tone}>{expiry.label}</ExpiryText>
      ) : null}

      {safeMeta.length || physicalProductLink ? (
        <MetaSection>
          {safeMeta.map((item) => (
            <MetaRow key={item.label}>
              <MetaKey>
                <MetaLabelText>{item.label}</MetaLabelText>
              </MetaKey>
              <MetaValueText>{item.value}</MetaValueText>
            </MetaRow>
          ))}
          {physicalProductLink ? (
            <PhysicalProductLinkRow>
              <PhysicalProductLinkAnchor
                href={normalizeExternalUrl(physicalProductLink)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkIcon width={18} height={18} />
                <span>{t("singleContent.meta.orderPhysicalEdition")}</span>
              </PhysicalProductLinkAnchor>
            </PhysicalProductLinkRow>
          ) : null}
        </MetaSection>
      ) : null}
    </ContentShell>
  );
}
