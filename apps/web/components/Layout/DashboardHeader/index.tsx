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
} from "./styles";
import { MonoText } from "@/components/UI/Monotext";

const headerInfo = {
  channel: "My channel",
  email: "lena@gmail.com",
};

const getInitial = (email: string) => email.charAt(0).toUpperCase();

const DashboardHeader = () => {
  return (
    <HeaderWrapper>
      <Left>
        <Image
          src={logo}
          alt="logo"
          width={90}
          height={28}
          style={{ width: "auto", height: "auto" }}
        />
      </Left>

      <Right>
        <MonoText $use="Body_Medium">{headerInfo.channel}</MonoText>
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
