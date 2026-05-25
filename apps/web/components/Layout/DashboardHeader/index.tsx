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
import { ROLE_CREATOR, ROLE_VIEWER } from "@/utils/Constants";
import {
  getLoginUserEmail,
  getLoginUserInitial,
  useStoredLoginUser,
} from "@/hooks/auth/useStoredLoginUser";
import { useCreatorChannelLayout } from "@/hooks/useCreatorChannelLayout";

type Props = {
  role: typeof ROLE_CREATOR | typeof ROLE_VIEWER;
  onToggleSidebar?: () => void;
  onProfileClick?: () => void;
};

const DashboardHeader = ({ role, onToggleSidebar, onProfileClick }: Props) => {
  const { t } = useTranslation();
  const user = useStoredLoginUser();
  const email = getLoginUserEmail(user);
  const initial = getLoginUserInitial(user);

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
        <LogoButton type="button" aria-label={t("nav.logoAlt")}>
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
          <NavItem href={PATHS.HOW_IT_WORKS}>{t("nav.howItWorks")}</NavItem>
          <NavItem href={PATHS.EXPLORE_CREATORS}>
            {t("nav.exploreCreators")}
          </NavItem>
          <NavItem href={PATHS.ABOUT}>{t("nav.about")}</NavItem>
        </Nav>
      )}

      <Right>
        {role === ROLE_CREATOR ? (
          <CreatorHeaderRight initial={initial} email={email} />
        ) : (
          <ProfileButton
            aria-label={t("common.viewerProfile")}
            onClick={onProfileClick}
          >
            {initial || "V"}
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

const CreatorHeaderRight = ({
  initial,
  email,
}: {
  initial: string;
  email: string;
}) => {
  const { t } = useTranslation();
  const { channelHref } = useCreatorChannelLayout();

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

export default DashboardHeader;
