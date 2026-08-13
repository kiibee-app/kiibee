"use client";

import { useTranslation } from "react-i18next";
import ProfileChannelSearch from "@/components/Feature/ProfileLayout/shared/ProfileChannelSearch";
import CreatorChannelAvatar from "@/components/Feature/ProfileLayout/shared/CreatorChannelAvatar";
import {
  getPublicCreatorProfilePath,
  CREATOR_LAYOUTS,
} from "@/utils/creatorChannel";
import { PATHS } from "@/utils/path";
import { CREATE_PROFILE_HOME, NAV } from "@/utils/translationKeys";
import { MonoText } from "@/components/UI/Monotext";
import GenericButton from "@/components/UI/GenericButton";
import {
  CREATOR_CHANNEL_AVATAR_TEXT,
  profileNavShellProps,
  VARIANT,
  TONE_DARK,
  TONE_LIGHT,
} from "@/utils/Constants";
import { TEXT_COLOR_VALUES } from "@/utils/appearance";
import NavBar from "@/components/Layout/Navbar";
import { SearchIconButton } from "@/components/Layout/Navbar/styles";
import { SearchIcon } from "@/assets/icons/searchBarIcon";
import { useRouter } from "next/navigation";
import { BackButtonIcon } from "@/assets/icons";
import {
  Brand,
  BrandAvatar,
  BrandName,
  BrandWrapper,
  BackButton,
} from "@/components/Feature/ProfileLayout/pageStyles";
import type { ProfileLayoutVariant } from "@/components/Feature/ProfileLayout/config";
import { useCreatorChannelProfile } from "@/hooks/useCreatorChannelProfile";
import { useCreatorNavItems } from "@/hooks/useCreatorChannelLayout";
import { isBrowser } from "@/utils/ui";

type ProfileNavbarProps = {
  variant: ProfileLayoutVariant;
};

const LAYOUT_1 = CREATOR_LAYOUTS[0].param;
const LAYOUT_2 = CREATOR_LAYOUTS[1].param;
const LAYOUT_3 = CREATOR_LAYOUTS[2].param;

const navConfigByVariant: Record<
  ProfileLayoutVariant,
  {
    navTextTone: typeof TONE_DARK | typeof TONE_LIGHT;
    showNavItems: boolean;
    hasSearch: boolean;
  }
> = {
  [LAYOUT_1]: {
    navTextTone: TONE_DARK,
    showNavItems: false,
    hasSearch: false,
  },
  [LAYOUT_2]: {
    navTextTone: TONE_DARK,
    showNavItems: true,
    hasSearch: true,
  },
  [LAYOUT_3]: {
    navTextTone: TONE_LIGHT,
    showNavItems: false,
    hasSearch: false,
  },
};

export default function ProfileNavbar({ variant }: ProfileNavbarProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const config = navConfigByVariant[variant] || {
    navTextTone: TONE_DARK,
    showNavItems: false,
    hasSearch: false,
  };
  const { showNavItems, hasSearch } = config;
  const { navItems } = useCreatorNavItems();
  const {
    displayName,
    avatarUrl,
    initial,
    isPublicView,
    publicCreatorId,
    textColor,
  } = useCreatorChannelProfile();
  const navTextTone =
    textColor === TEXT_COLOR_VALUES.WHITE_TEXT
      ? TONE_LIGHT
      : textColor === TEXT_COLOR_VALUES.DARK_TEXT
        ? TONE_DARK
        : config.navTextTone;
  const brandName = displayName;
  const brandHref =
    isPublicView && publicCreatorId
      ? getPublicCreatorProfilePath(publicCreatorId, variant)
      : PATHS.DASHBOARD_CREATOR;

  const handleBack = () => {
    if (isBrowser && window.history.length > 1) {
      router.back();
    } else {
      router.push(PATHS.EXPLORE);
    }
  };

  const brand = (
    <BrandWrapper>
      <BackButton
        type="button"
        onClick={handleBack}
        aria-label={t("common.goBack")}
      >
        <BackButtonIcon size={36} />
      </BackButton>
      <Brand href={brandHref}>
        <BrandAvatar>
          <CreatorChannelAvatar
            avatarUrl={avatarUrl}
            initial={initial}
            alt={brandName || t(CREATE_PROFILE_HOME.brandName)}
            sizes="44px"
            initialUse={CREATOR_CHANNEL_AVATAR_TEXT.NAVBAR}
          />
        </BrandAvatar>
        <BrandName $textTone={navTextTone}>
          <MonoText $use="Body_SemiBold">{brandName}</MonoText>
        </BrandName>
      </Brand>
    </BrandWrapper>
  );

  const actions = (
    <>
      <SearchIconButton href={PATHS.EXPLORE} aria-label={t(NAV.explore)}>
        <SearchIcon width={18} height={18} color="currentColor" />
      </SearchIconButton>
      <GenericButton
        asAnchor
        href={PATHS.AUTH_LOGIN}
        variant={VARIANT.SECONDARY}
      >
        {t(NAV.login)}
      </GenericButton>
      <GenericButton
        asAnchor
        href={PATHS.AUTH_SIGNUP_CREATOR}
        variant={VARIANT.PRIMARY}
      >
        {t(NAV.startCreating)}
      </GenericButton>
    </>
  );

  return (
    <NavBar
      {...profileNavShellProps}
      brand={brand}
      items={showNavItems ? navItems : []}
      hideMobileHamburger={true}
      showActionsOnMobile={true}
      routeActiveItems={showNavItems}
      navBefore={
        hasSearch ? <ProfileChannelSearch textTone={navTextTone} /> : undefined
      }
      navTextTone={navTextTone}
      actions={actions}
    />
  );
}
