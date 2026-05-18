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

type Props = {
  onToggleSidebar?: () => void;
};

const DashboardHeader = ({ onToggleSidebar }: Props) => {
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
      </Left>

      <Right>
        <ChannelText $use="Body_Medium">
          {t("dashboard.creatorHeader.myChannel")}
        </ChannelText>
        <Divider />
        <Link
          href={PATHS.DASHBOARD_CREATOR_PROFILE}
          aria-label="Creator profile"
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
      </Right>
    </HeaderWrapper>
  );
};

const RightProfileWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  text-decoration: none;
`;

export default DashboardHeader;
