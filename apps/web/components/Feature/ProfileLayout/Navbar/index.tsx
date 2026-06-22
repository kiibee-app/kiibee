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
import NavBar from "@/components/Layout/Navbar";
import {
  Brand,
  BrandAvatar,
  BrandName,
} from "@/components/Feature/ProfileLayout/pageStyles";
import type { ProfileLayoutVariant } from "@/components/Feature/ProfileLayout/config";
import { useCreatorChannelProfile } from "@/hooks/useCreatorChannelProfile";
import { useCreatorNavItems } from "@/hooks/useCreatorChannelLayout";

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
    navTextTone: TONE_LIGHT,
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
  const { t } = useTranslation();
  const config = navConfigByVariant[variant] || {
    navTextTone: TONE_DARK,
    showNavItems: false,
    hasSearch: false,
  };
  const { navTextTone, showNavItems, hasSearch } = config;
  const { navItems } = useCreatorNavItems();
  const { displayName, avatarUrl, initial, isPublicView, publicCreatorId } =
    useCreatorChannelProfile();
  const brandName = displayName;
  const brandHref =
    isPublicView && publicCreatorId
      ? getPublicCreatorProfilePath(publicCreatorId, variant)
      : PATHS.DASHBOARD_CREATOR;

  const brand = (
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
  );

  const actions = (
    <>
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
      navBefore={hasSearch ? <ProfileChannelSearch /> : undefined}
      navTextTone={navTextTone}
      actions={actions}
    />
  );
}
