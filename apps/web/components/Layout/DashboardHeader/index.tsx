"use client";

import React from "react";
import Image from "next/image";
import logo from "@/assets/images/kiibee-wordmark.webp";
import {
  HeaderWrapper,
  HamburgerButton,
  HamburgerLine,
  Nav,
  NavItem,
  Right,
  Divider,
  ProfileCircle,
  InitialAvatar,
  EmailWrapper,
  Left,
  LogoButton,
  RoleRight,
  ChannelText,
} from "./styles";
import { MonoText } from "@/components/UI/Monotext";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { PATHS } from "@/utils/path";
import { DASHBOARD_HEADER_TEXT, USER_ROLES, UserRole } from "@/utils/Constants";
import {
  getLoginUserEmail,
  getLoginUserInitial,
  useStoredLoginUser,
} from "@/hooks/auth/useStoredLoginUser";

type Props = {
  role: UserRole;
  onToggleSidebar?: () => void;
  onProfileClick?: () => void;
};

const DashboardHeader = ({ role, onToggleSidebar, onProfileClick }: Props) => {
  const { t } = useTranslation();
  const user = useStoredLoginUser();
  const email = getLoginUserEmail(user);
  const initial = getLoginUserInitial(user);
  const isCreator = role === USER_ROLES.CREATOR;

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
        {isCreator ? (
          <LogoButton
            type="button"
            onClick={onToggleSidebar}
            aria-label={t("dashboard.toggleSidebar")}
          >
            <Image
              src={logo}
              alt={t("nav.logoAlt")}
              width={80}
              height={25}
              priority
            />
          </LogoButton>
        ) : (
          <Link href={PATHS.HOME}>
            <Image
              src={logo}
              alt={t("nav.logoAlt")}
              width={84}
              height={27}
              priority
            />
          </Link>
        )}
      </Left>

      {!isCreator && (
        <Nav>
          <NavItem href={PATHS.HOW_IT_WORKS}>{t("nav.howItWorks")}</NavItem>
          <NavItem href={PATHS.EXPLORE_CREATORS}>
            {t("nav.exploreCreators")}
          </NavItem>
          <NavItem href={PATHS.ABOUT}>{t("nav.about")}</NavItem>
        </Nav>
      )}

      <Right>
        {isCreator && (
          <>
            <ChannelText $use="Body_Medium">
              {t("dashboard.creatorHeader.myChannel")}
            </ChannelText>
            <Divider />
          </>
        )}
        {isCreator ? (
          <Link
            href={PATHS.DASHBOARD_CREATOR_PROFILE}
            aria-label={DASHBOARD_HEADER_TEXT.CREATOR_PROFILE_ARIA_LABEL}
          >
            <RoleRight $role={role}>
              <ProfileCircle>
                <InitialAvatar>{initial}</InitialAvatar>
              </ProfileCircle>
              <EmailWrapper>
                <MonoText $use="Body_Medium">{email}</MonoText>
              </EmailWrapper>
            </RoleRight>
          </Link>
        ) : (
          <RoleRight
            as="button"
            type="button"
            $role={role}
            aria-label={DASHBOARD_HEADER_TEXT.VIEWER_PROFILE_ARIA_LABEL}
            onClick={onProfileClick}
          >
            <ProfileCircle>
              <InitialAvatar>{initial}</InitialAvatar>
            </ProfileCircle>
          </RoleRight>
        )}
      </Right>
    </HeaderWrapper>
  );
};

export default DashboardHeader;
