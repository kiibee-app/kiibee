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
  MobileToggle,
  ChannelText,
} from "./styles";
import { MonoText } from "@/components/UI/Monotext";
import { HomeIcon } from "@/assets/icons/homeIcon";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import styled from "styled-components";

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
        <MobileToggle onClick={onToggleSidebar}>
          <HomeIcon width={24} height={24} />
        </MobileToggle>
        <Image
          src={logo}
          alt={t("nav.logoAlt")}
          width={80}
          height={25}
          priority
        />
      </Left>

      <Right>
        <ChannelText $use="Body_Medium">{headerInfo.channel}</ChannelText>
        <Divider />
        <Link
          href="/dashboard/creators?view=profile"
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
