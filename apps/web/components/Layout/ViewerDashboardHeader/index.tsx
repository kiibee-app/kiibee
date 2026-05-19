"use client";

import React from "react";
import Image from "next/image";
import logo from "@/assets/images/kiibee-wordmark.webp";
import { PATHS } from "@/utils/path";
import {
  HamburgerButton,
  HamburgerLine,
  HeaderWrapper,
  Left,
  LogoButton,
  Nav,
  NavItem,
  ProfileButton,
  Right,
} from "./styles";
import { useTranslation } from "react-i18next";

type ViewerDashboardHeaderProps = {
  onToggleSidebar?: () => void;
  onProfileClick?: () => void;
};

export default function ViewerDashboardHeader({
  onToggleSidebar,
  onProfileClick,
}: ViewerDashboardHeaderProps) {
  const { t } = useTranslation();

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
          onClick={onToggleSidebar}
          aria-label={t("dashboard.toggleSidebar")}
        >
          <Image
            src={logo}
            alt={t("nav.logoAlt")}
            width={84}
            height={27}
            priority
          />
        </LogoButton>
      </Left>

      <Nav>
        <NavItem href={PATHS.HOW_IT_WORKS}>{t("nav.howItWorks")}</NavItem>
        <NavItem href={PATHS.EXPLORE_CREATORS}>
          {t("nav.exploreCreators")}
        </NavItem>
        <NavItem href={PATHS.ABOUT}>{t("nav.about")}</NavItem>
      </Nav>

      <Right>
        <ProfileButton aria-label="Viewer profile" onClick={onProfileClick}>
          L
        </ProfileButton>
      </Right>
    </HeaderWrapper>
  );
}
