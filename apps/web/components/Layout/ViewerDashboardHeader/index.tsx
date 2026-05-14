"use client";

import React from "react";
import Image from "next/image";
import logo from "@/assets/images/kiibee-wordmark.webp";
import { HomeIcon } from "@/assets/icons/homeIcon";
import {
  HeaderWrapper,
  Left,
  MobileToggle,
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
        <MobileToggle onClick={onToggleSidebar} aria-label="Toggle sidebar">
          <HomeIcon width={24} height={24} />
        </MobileToggle>
        <Image
          src={logo}
          alt={t("nav.logoAlt")}
          width={84}
          height={27}
          priority
        />
      </Left>

      <Nav>
        <NavItem>{t("nav.howItWorks")}</NavItem>
        <NavItem>{t("nav.exploreCreators")}</NavItem>
        <NavItem>{t("nav.about")}</NavItem>
      </Nav>

      <Right>
        <ProfileButton aria-label="Viewer profile" onClick={onProfileClick}>
          L
        </ProfileButton>
      </Right>
    </HeaderWrapper>
  );
}
