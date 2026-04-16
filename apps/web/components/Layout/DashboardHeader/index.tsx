"use client";

import React from "react";
import Image from "next/image";
import logo from "@/assets/images/kiibee-wordmark.png";
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

type Props = {
  onToggleSidebar?: () => void;
};

const headerInfo = {
  channel: "My channel",
  email: "lena@gmail.com",
};

const getInitial = (email: string) => email.charAt(0).toUpperCase();

const DashboardHeader = ({ onToggleSidebar }: Props) => {
  return (
    <HeaderWrapper>
      <Left>
        <MobileToggle onClick={onToggleSidebar}>
          <HomeIcon width={24} height={24} />
        </MobileToggle>
        <Image src={logo} alt="logo" width={90} height={28} />
      </Left>

      <Right>
        <ChannelText $use="Body_Medium">{headerInfo.channel}</ChannelText>{" "}
        <Divider />
        <ProfileCircle>
          <InitialAvatar>{getInitial(headerInfo.email)}</InitialAvatar>
        </ProfileCircle>
        <EmailWrapper>
          <MonoText $use="Body_Medium">{headerInfo.email}</MonoText>
        </EmailWrapper>
      </Right>
    </HeaderWrapper>
  );
};

export default DashboardHeader;
