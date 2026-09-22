"use client";

import React from "react";
import Image from "next/image";
import logo from "@/assets/images/kiibee-wordmark.webp";
import {
  HeaderWrapper,
  HamburgerButton,
  HamburgerLine,
  Right,
  Left,
  LogoButton,
  Nav,
  NavItem,
} from "./styles";
import { useTranslation } from "react-i18next";
import { ROLE_CREATOR, ROLE_VIEWER } from "@/utils/Constants";
import {
  getDisplayFirstLetter,
  useStoredLoginUser,
} from "@/hooks/auth/useStoredLoginUser";
import { useCreatorChannelProfile } from "@/hooks/useCreatorChannelProfile";
import { getAvatarUrl } from "@/utils/creatorProfile";
import { useRouter } from "next/navigation";
import CreatorHeaderRight from "./CreatorHeaderRight";
import ViewerHeaderRight from "./ViewerHeaderRight";
import LanguageToggle from "@/components/UI/LanguageToggle";
import { useLocalizedPaths } from "@/hooks/useLocalizedPaths";

type Props = {
  role: typeof ROLE_CREATOR | typeof ROLE_VIEWER;
  onToggleSidebar?: () => void;
  onProfileClick?: () => void;
};

const DashboardHeader = ({ role, onToggleSidebar, onProfileClick }: Props) => {
  const { t } = useTranslation();
  const user = useStoredLoginUser();
  const isCreator = role === ROLE_CREATOR;
  const router = useRouter();
  const paths = useLocalizedPaths();
  const { avatarUrl: profileAvatarUrl, displayName } =
    useCreatorChannelProfile(isCreator);
  const initial = getDisplayFirstLetter(displayName, user);
  const avatarUrl =
    profileAvatarUrl ??
    getAvatarUrl(user?.avatarUrl as string | null | undefined);

  return (
    <HeaderWrapper>
      <Left>
        <HamburgerButton
          type="button"
          onClick={onToggleSidebar}
          aria-label={t("dashboard.toggleSidebar")}
        >
          <HamburgerLine />
          <HamburgerLine />
          <HamburgerLine />
        </HamburgerButton>
        <LogoButton
          type="button"
          aria-label={t("nav.logoAlt")}
          onClick={() => router.push(paths.HOME)}
        >
          <Image
            src={logo}
            alt={t("nav.logoAlt")}
            width={80}
            height={25}
            priority
          />
        </LogoButton>
      </Left>

      {role === ROLE_VIEWER && (
        <Nav>
          <NavItem href={paths.HOW_IT_WORKS}>{t("nav.howItWorks")}</NavItem>
          <NavItem href={paths.EXPLORE}>{t("nav.exploreCreators")}</NavItem>
          <NavItem href={paths.ABOUT}>{t("nav.about")}</NavItem>
        </Nav>
      )}

      <Right>
        <LanguageToggle />
        {role === ROLE_CREATOR ? (
          <CreatorHeaderRight
            initial={initial}
            displayName={displayName}
            avatarUrl={avatarUrl}
          />
        ) : (
          <ViewerHeaderRight
            initial={initial || "V"}
            avatarUrl={avatarUrl}
            onProfileClick={onProfileClick}
          />
        )}
      </Right>
    </HeaderWrapper>
  );
};

export default DashboardHeader;
export { default as CreatorHeaderRight } from "./CreatorHeaderRight";
export { default as ViewerHeaderRight } from "./ViewerHeaderRight";
export { default as AccountMenu } from "./AccountMenu";
