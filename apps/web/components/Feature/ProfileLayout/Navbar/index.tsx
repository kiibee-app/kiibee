"use client";

import { useTranslation } from "react-i18next";
import { SearchIcon } from "@/assets/icons/searchBarIcon";
import CreatorChannelAvatar from "@/components/Feature/ProfileLayout/shared/CreatorChannelAvatar";
import { getPublicCreatorProfilePath } from "@/utils/creatorChannel";
import { PATHS } from "@/utils/path";
import { CREATE_PROFILE_HOME, NAV } from "@/utils/translationKeys";
import { MonoText } from "@/components/UI/Monotext";
import GenericButton from "@/components/UI/GenericButton";
import {
  CREATOR_CHANNEL_AVATAR_TEXT,
  profileNavShellProps,
  VARIANT,
} from "@/utils/Constants";
import NavBar from "@/components/Layout/Navbar";
import CreatorInfoModal from "@/components/Feature/ProfileLayout/shared/CreatorInfoModal";
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

export default function ProfileNavbar({ variant }: ProfileNavbarProps) {
  const { t } = useTranslation();
  const showNavItems = variant === "2";
  const { navItems, isAboutOpen, closeAbout } = useCreatorNavItems();
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
      <BrandName>
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

  if (!showNavItems) {
    return (
      <NavBar
        {...profileNavShellProps}
        items={[]}
        brand={brand}
        actions={actions}
      />
    );
  }

  return (
    <>
      <NavBar
        {...profileNavShellProps}
        brand={brand}
        items={navItems}
        navBefore={<SearchIcon width={18} height={18} />}
        actions={actions}
      />
      <CreatorInfoModal visible={isAboutOpen} onClose={closeAbout} />
    </>
  );
}
