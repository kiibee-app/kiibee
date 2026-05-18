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
