"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { SearchIcon } from "@/assets/icons/searchBarIcon";
import portrait1 from "@/assets/images/creators/profile_pic.png";
import portrait2 from "@/assets/images/creators/creator-woman-gray-jacket.webp";
import { PATHS } from "@/utils/path";
import { CREATE_PROFILE_HOME, NAV } from "@/utils/translationKeys";
import { MonoText } from "@/components/UI/Monotext";
import GenericButton from "@/components/UI/GenericButton";
import { profileNavShellProps, VARIANT } from "@/utils/Constants";
import NavBar from "@/components/Layout/Navbar";
import CreatorInfoModal from "@/components/Feature/ProfileLayout/shared/CreatorInfoModal";
import {
  Brand,
  BrandAvatar,
  BrandAvatarImage,
  BrandName,
} from "@/components/Feature/ProfileLayout/pageStyles";
import type { ProfileLayoutVariant } from "@/components/Feature/ProfileLayout/config";
import { useCreatorNavItems } from "@/hooks/useCreatorChannelLayout";

type ProfileNavbarProps = {
  variant: ProfileLayoutVariant;
};

export default function ProfileNavbar({ variant }: ProfileNavbarProps) {
  const { t } = useTranslation();
  const showNavItems = variant === "2";
  const { navItems, isAboutOpen, closeAbout } = useCreatorNavItems();
  const portrait = showNavItems ? portrait2 : portrait1;

  const brand = (
    <Brand href={PATHS.DASHBOARD_CREATOR}>
      <BrandAvatar>
        {showNavItems ? (
          <Image
            src={portrait}
            alt={t(CREATE_PROFILE_HOME.brandName)}
            fill
            sizes="40px"
            style={{ objectFit: "cover" }}
            priority
          />
        ) : (
          <BrandAvatarImage
            src={portrait}
            alt={t(CREATE_PROFILE_HOME.brandName)}
            fill
            sizes="40px"
            priority
          />
        )}
      </BrandAvatar>
      <BrandName>
        <MonoText $use="Body_SemiBold">
          {t(CREATE_PROFILE_HOME.brandName)}
        </MonoText>
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
