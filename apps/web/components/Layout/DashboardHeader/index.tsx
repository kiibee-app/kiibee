"use client";

import React from "react";
import Image from "next/image";
import logo from "@/assets/images/kiibee-wordmark.webp";
import {
  HeaderWrapper,
  HamburgerButton,
  HamburgerLine,
  Right,
  Divider,
  ProfileCircle,
  InitialAvatar,
  EmailWrapper,
  Left,
  LogoButton,
  ChannelText,
  Nav,
  NavItem,
  ProfileButton,
} from "./styles";
import { MonoText } from "@/components/UI/Monotext";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import styled from "styled-components";
import { PATHS } from "@/utils/path";
import {
  getLoginUserEmail,
  getLoginUserInitial,
  useStoredLoginUser,
} from "@/hooks/auth/useStoredLoginUser";
import { useCreatorChannelLayout } from "@/hooks/useCreatorChannelLayout";
import { DASHBOARD_ROLES, type DashboardRole } from "@/utils/Constants";

type Props = {
  role: DashboardRole;
  onToggleSidebar?: () => void;
  onProfileClick?: () => void;
};

const CreatorHeaderContent = () => {
  const { t } = useTranslation();
  const { channelHref } = useCreatorChannelLayout();
  const user = useStoredLoginUser();
  const email = getLoginUserEmail(user);
  const initial = getLoginUserInitial(user);

  return (
    <>
      <ChannelLink href={channelHref}>
        <ChannelText $use="Body_Medium">
          {t("dashboard.creatorHeader.myChannel")}
        </ChannelText>
      </ChannelLink>
      <Divider />
      <Link
        href={PATHS.DASHBOARD_CREATOR_PROFILE}
        aria-label={t("common.creatorProfile")}
      >
        <RightProfileWrapper>
          <ProfileCircle>
            <InitialAvatar>{initial}</InitialAvatar>
          </ProfileCircle>
          <EmailWrapper>
            <MonoText $use="Body_Medium">{email}</MonoText>
          </EmailWrapper>
        </RightProfileWrapper>
      </Link>
    </>
  );
};

const DashboardHeader = ({ role, onToggleSidebar, onProfileClick }: Props) => {
  const { t } = useTranslation();
  const user = useStoredLoginUser();
  const initial = getLoginUserInitial(user);
  const displayInitial = initial && initial !== "?" ? initial : "L";

  return (
    <HeaderWrapper $role={role}>
      <Left $role={role}>
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
            width={role === DASHBOARD_ROLES.CREATOR ? 80 : 84}
            height={role === DASHBOARD_ROLES.CREATOR ? 25 : 27}
            priority
          />
        </LogoButton>
      </Left>

      {role === DASHBOARD_ROLES.VIEWER && (
        <Nav>
          <NavItem href={PATHS.HOW_IT_WORKS}>{t("nav.howItWorks")}</NavItem>
          <NavItem href={PATHS.EXPLORE_CREATORS}>
            {t("nav.exploreCreators")}
          </NavItem>
          <NavItem href={PATHS.ABOUT}>{t("nav.about")}</NavItem>
        </Nav>
      )}

      <Right $role={role}>
        {role === DASHBOARD_ROLES.CREATOR ? (
          <CreatorHeaderContent />
        ) : (
          <ProfileButton
            aria-label={t("common.viewerProfile")}
            onClick={onProfileClick}
          >
            {displayInitial}
          </ProfileButton>
        )}
      </Right>
    </HeaderWrapper>
  );
};

const ChannelLink = styled(Link)`
  text-decoration: none;
  color: inherit;

  &:hover {
    text-decoration: underline;
  }
`;

const RightProfileWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  text-decoration: none;
`;

export default DashboardHeader;
