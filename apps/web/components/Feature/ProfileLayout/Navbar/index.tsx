"use client";

import { useTranslation } from "react-i18next";
import { ThreeDotIcon } from "@/assets/icons";
import ProfileChannelSearch from "@/components/Feature/ProfileLayout/shared/ProfileChannelSearch";
import CreatorChannelAvatar from "@/components/Feature/ProfileLayout/shared/CreatorChannelAvatar";
import {
  getPublicCreatorProfilePath,
  CREATOR_LAYOUTS,
} from "@/utils/creatorChannel";
import { PATHS, pathLoginWithNext } from "@/utils/path";
import { CREATE_PROFILE_HOME, NAV } from "@/utils/translationKeys";
import { MonoText } from "@/components/UI/Monotext";
import GenericButton from "@/components/UI/GenericButton";
import {
  CREATOR_CHANNEL_AVATAR_TEXT,
  profileNavShellProps,
  VARIANT,
  TONE_DARK,
  TONE_LIGHT,
  DRAWER_SIDE,
  DRAWER_VARIANT,
} from "@/utils/Constants";
import NavBar from "@/components/Layout/Navbar";
import {
  Brand,
  BrandAvatar,
  BrandName,
  MobileProfileTriggerAvatar,
  MobileProfileTriggerButton,
} from "@/components/Feature/ProfileLayout/pageStyles";
import type { ProfileLayoutVariant } from "@/components/Feature/ProfileLayout/config";
import {
  getLoginUserFirstLetter,
  useLoginUserAvatar,
  useStoredLoginUser,
} from "@/hooks/auth/useStoredLoginUser";
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
  const storedUser = useStoredLoginUser();
  const loginUserAvatarUrl = useLoginUserAvatar();
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

  const loginHref =
    typeof window !== "undefined"
      ? pathLoginWithNext(window.location.pathname + window.location.search)
      : PATHS.AUTH_LOGIN;

  const actions = (
    <>
      <GenericButton asAnchor href={loginHref} variant={VARIANT.SECONDARY}>
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
  const mobileProfileTrigger = (
    <MobileProfileTriggerButton type="button" aria-label={t(NAV.profileMenu)}>
      {storedUser ? (
        <MobileProfileTriggerAvatar>
          <CreatorChannelAvatar
            avatarUrl={loginUserAvatarUrl}
            initial={getLoginUserFirstLetter(storedUser)}
            alt={t(NAV.profileMenu)}
            sizes="36px"
            initialUse={CREATOR_CHANNEL_AVATAR_TEXT.NAVBAR}
          />
        </MobileProfileTriggerAvatar>
      ) : (
        <ThreeDotIcon />
      )}
    </MobileProfileTriggerButton>
  );
  return (
    <NavBar
      {...profileNavShellProps}
      brand={brand}
      items={showNavItems ? navItems : []}
      mobileDrawerItems={showNavItems ? navItems : []}
      mobileDrawerTrigger={mobileProfileTrigger}
      mobileDrawerSide={DRAWER_SIDE.RIGHT}
      mobileDrawerVariant={DRAWER_VARIANT.DROPDOWN}
      mobileDrawerRouteActiveItems={true}
      hideMobileHamburger={true}
      routeActiveItems={showNavItems}
      navBefore={hasSearch ? <ProfileChannelSearch /> : undefined}
      navTextTone={navTextTone}
      actions={actions}
    />
  );
}
