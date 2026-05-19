"use client";

import React from "react";
import Image from "next/image";
import logo from "@/assets/images/kiibee-wordmark.webp";
import { HeaderWrapper, ProfileCircle, InitialAvatar } from "./styles";
import { useTranslation } from "react-i18next";
import { USER_ROLES, UserRole } from "@/utils/Constants";
import {
  getLoginUserEmail,
  getLoginUserInitial,
  useStoredLoginUser,
} from "@/hooks/auth/useStoredLoginUser";
import { CreatorNav } from "./CreatorNav";
import { ViewerNav } from "./ViewerNav";

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

  const logoImage = (
    <Image
      src={logo}
      alt={t("nav.logoAlt")}
      width={isCreator ? 80 : 84}
      height={isCreator ? 25 : 27}
      priority
    />
  );

  const avatar = (
    <ProfileCircle>
      <InitialAvatar>{initial}</InitialAvatar>
    </ProfileCircle>
  );

  return (
    <HeaderWrapper>
      {isCreator ? (
        <CreatorNav
          role={role}
          email={email}
          avatar={avatar}
          logoImage={logoImage}
          onToggleSidebar={onToggleSidebar}
          t={t}
        />
      ) : (
        <ViewerNav
          role={role}
          avatar={avatar}
          logoImage={logoImage}
          onToggleSidebar={onToggleSidebar}
          onProfileClick={onProfileClick}
          t={t}
        />
      )}
    </HeaderWrapper>
  );
};

export default DashboardHeader;
