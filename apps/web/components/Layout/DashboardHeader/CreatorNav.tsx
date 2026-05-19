import React from "react";
import Link from "next/link";
import {
  Left,
  HamburgerButton,
  HamburgerLine,
  LogoButton,
  Right,
  ChannelText,
  Divider,
  RoleRight,
  EmailWrapper,
} from "./styles";
import { MonoText } from "@/components/UI/Monotext";
import { PATHS } from "@/utils/path";
import { DASHBOARD_HEADER_TEXT, UserRole } from "@/utils/Constants";

type CreatorNavProps = {
  role: UserRole;
  email: string;
  avatar: React.ReactNode;
  logoImage: React.ReactNode;
  onToggleSidebar?: () => void;
  t: (key: string) => string;
};

export const CreatorNav = ({
  role,
  email,
  avatar,
  logoImage,
  onToggleSidebar,
  t,
}: CreatorNavProps) => (
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
      <LogoButton
        type="button"
        onClick={onToggleSidebar}
        aria-label={t("dashboard.toggleSidebar")}
      >
        {logoImage}
      </LogoButton>
    </Left>

    <Right>
      <ChannelText $use="Body_Medium">
        {t("dashboard.creatorHeader.myChannel")}
      </ChannelText>
      <Divider />
      <Link
        href={PATHS.DASHBOARD_CREATOR_PROFILE}
        aria-label={DASHBOARD_HEADER_TEXT.CREATOR_PROFILE_ARIA_LABEL}
      >
        <RoleRight $role={role}>
          {avatar}
          <EmailWrapper>
            <MonoText $use="Body_Medium">{email}</MonoText>
          </EmailWrapper>
        </RoleRight>
      </Link>
    </Right>
  </>
);
