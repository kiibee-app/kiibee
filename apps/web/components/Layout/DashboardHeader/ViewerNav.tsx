import React from "react";
import Link from "next/link";
import {
  Left,
  HamburgerButton,
  HamburgerLine,
  Nav,
  NavItem,
  Right,
  RoleRight,
} from "./styles";
import { PATHS } from "@/utils/path";
import { DASHBOARD_HEADER_TEXT, UserRole } from "@/utils/Constants";

type ViewerNavProps = {
  role: UserRole;
  avatar: React.ReactNode;
  logoImage: React.ReactNode;
  onToggleSidebar?: () => void;
  onProfileClick?: () => void;
  t: (key: string) => string;
};

export const ViewerNav = ({
  role,
  avatar,
  logoImage,
  onToggleSidebar,
  onProfileClick,
  t,
}: ViewerNavProps) => (
  <>
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
      <Link href={PATHS.HOME}>{logoImage}</Link>
    </Left>

    <Nav>
      <NavItem href={PATHS.HOW_IT_WORKS}>{t("nav.howItWorks")}</NavItem>
      <NavItem href={PATHS.EXPLORE_CREATORS}>
        {t("nav.exploreCreators")}
      </NavItem>
      <NavItem href={PATHS.ABOUT}>{t("nav.about")}</NavItem>
    </Nav>

    <Right>
      <RoleRight
        as="button"
        type="button"
        $role={role}
        aria-label={DASHBOARD_HEADER_TEXT.VIEWER_PROFILE_ARIA_LABEL}
        onClick={onProfileClick}
      >
        {avatar}
      </RoleRight>
    </Right>
  </>
);
