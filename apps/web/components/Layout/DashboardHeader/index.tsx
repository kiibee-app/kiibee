"use client";

import React from "react";
import Image from "next/image";
import logo from "@/assets/images/kiibee-wordmark.webp";
import {
  HeaderWrapper,
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

type Props = {
  onToggleSidebar?: () => void;
};

const headerInfo = {
  channel: "My channel",
  email: "lena@gmail.com",
};

const getInitial = (email: string) => email.charAt(0).toUpperCase();

const DashboardHeader = ({ onToggleSidebar }: Props) => {
  const { t } = useTranslation();
  return (
    <HeaderWrapper>
      <Left>
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
        <ChannelText $use="Body_Medium">{headerInfo.channel}</ChannelText>
        <Divider />
        <Link
          href={PATHS.DASHBOARD_CREATOR_PROFILE}
          aria-label="Creator profile"
        >
          <RightProfileWrapper>
            <ProfileCircle>
              <InitialAvatar>{getInitial(headerInfo.email)}</InitialAvatar>
            </ProfileCircle>
            <EmailWrapper>
              <MonoText $use="Body_Medium">{headerInfo.email}</MonoText>
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
