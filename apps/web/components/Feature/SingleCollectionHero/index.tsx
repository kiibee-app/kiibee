"use client";

import Image from "@/components/UI/SafeImage";
import {
  HeroWrapper,
  HeroContent,
  ActionButton,
  PricingActionButton,
  HeroImage,
  LogoRow,
  CreatorRow,
  CreatorAvatar,
  Description,
  PricingActions,
  PricingButtonContent,
  PricingButtonSubtitle,
  ContentRow,
  TopBar,
  BackButtonWrapper,
} from "./styles";
import { BackButtonIcon } from "@/assets/icons";
import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";
import collection from "@/assets/images/singleCollection.webp";
import { MonoText } from "@/components/UI/Monotext";
import GenericButton from "@/components/UI/GenericButton";
import { useRouter } from "next/navigation";
import { ShareIcon } from "@/assets/icons/shareIcon";
import { useTranslation } from "react-i18next";
import { NAV } from "@/utils/translationKeys";
import { VARIANT, CREATOR_CHANNEL_AVATAR_TEXT } from "@/utils/Constants";
import { pathPublishedContent } from "@/utils/path";
import useShare from "@/hooks/useShare";
import ShareModal from "@/components/UI/Modals/ShareModal";
import CreatorChannelAvatar from "@/components/Feature/ProfileLayout/shared/CreatorChannelAvatar";
import {
  getContentDetailPricingActions,
  getPricingLabels,
} from "@/utils/contentPricingActions";
import type { CollectionAccessType } from "@/utils/Constants";

type Props = {
  title: string;
  description?: string | null;
  creatorName?: string;
  creatorAvatar?: string;
  image?: string;
  imageFallback?: string;
  primaryContentId?: string;
  pricing?: {
    accessType?: CollectionAccessType;
    buyPrice?: number | null;
    rentPrice?: number | null;
    rentDurationHours?: number | null;
  };
  isOwner?: boolean;
  onOpenDashboard?: () => void;
};

export default function SingleCollectionHero({
  title,
  description,
  creatorName,
  creatorAvatar,
  image,
  imageFallback,
  primaryContentId,
  pricing,
  isOwner,
  onOpenDashboard,
}: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const { share, shareUrl, showShareModal, setShowShareModal } = useShare();
  const handleBack = () => {
    router.back();
  };
  const primaryContentHref = primaryContentId
    ? pathPublishedContent(primaryContentId)
    : undefined;
  const pricingActions = pricing
    ? getContentDetailPricingActions(pricing, t, {
        inCollection: true,
        labels: getPricingLabels(t),
      })
    : [];
  const creatorInitial = creatorName?.trim().charAt(0).toUpperCase() || "";

  return (
    <HeroWrapper>
      <TopBar>
        <BackButtonWrapper onClick={handleBack}>
          <BackButtonIcon />
        </BackButtonWrapper>
        <GenericButton variant={VARIANT.PRIMARY_LITE} onClick={share}>
          <ShareIcon />
          {t("common.share")}
        </GenericButton>
      </TopBar>
      <ContentRow>
        <HeroContent>
          {creatorName ? (
            <CreatorRow>
              <CreatorAvatar>
                <CreatorChannelAvatar
                  avatarUrl={creatorAvatar || null}
                  initial={creatorInitial}
                  alt={creatorName}
                  sizes="30px"
                  initialUse={CREATOR_CHANNEL_AVATAR_TEXT.COMPACT}
                />
              </CreatorAvatar>
              <MonoText $use="Body_Medium">{creatorName}</MonoText>
            </CreatorRow>
          ) : (
            <LogoRow>
              <Image
                src={logo}
                alt={t(NAV.logoAlt)}
                width={30}
                height={30}
                priority
              />
              <MonoText $use="H4_Medium">{t(NAV.logoAlt)}</MonoText>
            </LogoRow>
          )}

          <MonoText $use="Heading2">{title}</MonoText>
          <Description $use="Body_Medium">
            {description || t("singleCollection.subtitle")}
          </Description>

          {isOwner ? (
            <PricingActions style={{ marginTop: 0 }}>
              {onOpenDashboard && (
                <ActionButton onClick={onOpenDashboard}>
                  {t("singleContent.openInDashboard")}
                </ActionButton>
              )}
            </PricingActions>
          ) : pricingActions.length > 0 ? (
            <PricingActions>
              {pricingActions.map((action) => (
                <PricingActionButton
                  key={action.label}
                  variant={action.variant}
                >
                  <PricingButtonContent>
                    <span>{action.label}</span>
                    {action.subtitle ? (
                      <PricingButtonSubtitle>
                        {action.subtitle}
                      </PricingButtonSubtitle>
                    ) : null}
                  </PricingButtonContent>
                </PricingActionButton>
              ))}
            </PricingActions>
          ) : (
            <ActionButton
              asAnchor
              href={primaryContentHref}
              disabled={!primaryContentHref}
            >
              {t("singleCollection.seeContent")}
            </ActionButton>
          )}
        </HeroContent>

        <HeroImage>
          <Image
            src={image || collection}
            fallback={imageFallback}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 560px"
            style={{ objectFit: "cover" }}
            priority
          />
        </HeroImage>
      </ContentRow>

      <ShareModal
        visible={showShareModal}
        url={shareUrl}
        onClose={() => setShowShareModal(false)}
      />
    </HeroWrapper>
  );
}
