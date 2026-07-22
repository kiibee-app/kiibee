"use client";

import Image from "@/components/UI/SafeImage";
import {
  HeroWrapper,
  HeroContent,
  ActionButton,
  PricingActionButton,
  DisabledAccessButton,
  HeroImage,
  LogoRow,
  CreatorRow,
  CreatorAvatar,
  Description,
  PricingActions,
  OwnerActions,
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
import useShare from "@/hooks/useShare";
import ShareModal from "@/components/UI/Modals/ShareModal";
import CreatorChannelAvatar from "@/components/Feature/ProfileLayout/shared/CreatorChannelAvatar";
import {
  getContentDetailPricingActions,
  getPricingLabels,
} from "@/utils/contentPricingActions";
import type { CollectionAccessType, ImageSource } from "@/utils/Constants";
import {
  COLLECTION_ACCESS_STATUS,
  type CollectionAccessStatus,
} from "@/utils/viewerRented";

type Props = {
  title: string;
  description?: string | null;
  creatorName?: string;
  creatorAvatar?: string;
  image?: ImageSource;
  imageFallback?: string;
  primaryContentId?: string;
  pricing?: {
    accessType?: CollectionAccessType;
    buyPrice?: number | null;
    rentPrice?: number | null;
    rentDurationHours?: number | null;
  };
  onActionClick?: (action: {
    label: string;
    subtitle?: string;
    isPurchase: boolean;
  }) => void;
  isOwner?: boolean;
  userAccessStatus?: CollectionAccessStatus | null;
  onOpenDashboard?: () => void;
  onBack?: () => void;
  showBack?: boolean;
  embedded?: boolean;
};

export default function SingleCollectionHero({
  title,
  description,
  creatorName,
  creatorAvatar,
  image,
  imageFallback,
  pricing,
  onActionClick,
  isOwner,
  userAccessStatus,
  onOpenDashboard,
  onBack,
  showBack = true,
  embedded = false,
}: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const { share, shareUrl, showShareModal, setShowShareModal } = useShare();
  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    router.back();
  };
  const pricingActions = pricing
    ? getContentDetailPricingActions(pricing, t, {
        inCollection: true,
        labels: getPricingLabels(t),
      })
    : [];
  const creatorInitial = creatorName?.trim().charAt(0).toUpperCase() || "";

  const handlePricingActionClick = (
    action: (typeof pricingActions)[number],
  ) => {
    if (!onActionClick) return;
    const isPurchase = action.label
      .toLowerCase()
      .includes(t("pricingLabels.buy").toLowerCase());
    onActionClick({
      label: action.label,
      subtitle: action.subtitle,
      isPurchase,
    });
  };

  return (
    <HeroWrapper $embedded={embedded}>
      <TopBar $embedded={embedded}>
        {showBack ? (
          <BackButtonWrapper onClick={handleBack}>
            <BackButtonIcon />
          </BackButtonWrapper>
        ) : (
          <span />
        )}
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
            <OwnerActions>
              {onOpenDashboard && (
                <ActionButton onClick={onOpenDashboard}>
                  {t("singleContent.openInDashboard")}
                </ActionButton>
              )}
            </OwnerActions>
          ) : userAccessStatus === COLLECTION_ACCESS_STATUS.PURCHASED ? (
            <PricingActions>
              <DisabledAccessButton disabled>
                {t("viewerRented.purchased")}
              </DisabledAccessButton>
            </PricingActions>
          ) : userAccessStatus === COLLECTION_ACCESS_STATUS.RENTED ? (
            <PricingActions>
              <DisabledAccessButton disabled>
                {t("viewerRented.rented")}
              </DisabledAccessButton>
            </PricingActions>
          ) : pricingActions.length > 0 ? (
            <PricingActions>
              {pricingActions.map((action) => (
                <PricingActionButton
                  key={action.label}
                  variant={action.variant}
                  onClick={() => handlePricingActionClick(action)}
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
          ) : null}
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
            unoptimized={Boolean(image)}
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
