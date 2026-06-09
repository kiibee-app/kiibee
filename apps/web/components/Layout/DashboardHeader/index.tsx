"use client";

import React, { ReactNode, useRef, useState } from "react";
import Image from "next/image";
import logo from "@/assets/images/kiibee-wordmark.webp";
import {
  HeaderWrapper,
  HamburgerButton,
  HamburgerLine,
  Right,
  Divider,
  ProfileCircle,
  ProfileAvatarImage,
  InitialAvatar,
  EmailWrapper,
  Left,
  LogoButton,
  ChannelText,
  Nav,
  NavItem,
  ProfileButton,
  ChannelLink,
  RightProfileWrapper,
} from "./styles";
import { MonoText } from "@/components/UI/Monotext";
import { useTranslation } from "react-i18next";
import { PATHS } from "@/utils/path";
import { ROLE_CREATOR, ROLE_VIEWER } from "@/utils/Constants";
import { CLICK } from "@/utils/common";
import { NAV } from "@/utils/translationKeys";
import {
  getLoginUserEmail,
  getLoginUserFirstLetter,
  useStoredLoginUser,
} from "@/hooks/auth/useStoredLoginUser";
import { useCreatorChannelLayout } from "@/hooks/useCreatorChannelLayout";
import { useCreatorChannelProfile } from "@/hooks/useCreatorChannelProfile";
import { getAvatarUrl } from "@/utils/creatorProfile";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useLogout } from "@/hooks/auth/useLogout";
import {
  NavAccountDropdown,
  NavAccountHost,
  NavAccountMenuButton,
  NavAccountMenuDivider,
  NavAccountMenuIcon,
  NavAccountMenuItem,
  NavAccountTriggerWrap,
} from "@/components/Layout/Navbar/styles";
import { LogoutIcon } from "@/assets/icons/logoutIcon";
import { ProfileIcon } from "@/assets/icons/profileIcon";
import { useRouter } from "next/navigation";

type Props = {
  role: typeof ROLE_CREATOR | typeof ROLE_VIEWER;
  onToggleSidebar?: () => void;
  onProfileClick?: () => void;
};

const DashboardHeader = ({ role, onToggleSidebar, onProfileClick }: Props) => {
  const { t } = useTranslation();
  const user = useStoredLoginUser();
  const isCreator = role === ROLE_CREATOR;
  const router = useRouter();
  const { avatarUrl: profileAvatarUrl } = useCreatorChannelProfile(isCreator);
  const email = getLoginUserEmail(user);
  const initial = getLoginUserFirstLetter(user);
  const avatarUrl =
    profileAvatarUrl ??
    getAvatarUrl(user?.avatarUrl as string | null | undefined);

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
          aria-label={t("nav.logoAlt")}
          onClick={() => router.push(PATHS.HOME)}
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
          <CreatorHeaderRight
            initial={initial}
            email={email}
            avatarUrl={avatarUrl}
          />
        ) : (
          <ViewerHeaderRight
            initial={initial || "V"}
            avatarUrl={avatarUrl}
            onProfileClick={onProfileClick}
          />
        )}
      </Right>
    </HeaderWrapper>
  );
};

type AccountMenuProps = {
  trigger: (args: { open: boolean; toggle: () => void }) => ReactNode;
  profileAction: (closeMenu: () => void) => ReactNode;
};

const AccountMenu = ({ trigger, profileAction }: AccountMenuProps) => {
  const { t } = useTranslation();
  const { logout, isPending } = useLogout();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: menuRef,
    enabled: open,
    eventType: CLICK,
    handler: () => setOpen(false),
  });

  const closeMenu = () => setOpen(false);

  const handleLogout = () => {
    if (isPending) return;
    closeMenu();
    void logout();
  };

  return (
    <NavAccountHost ref={menuRef} $open={open}>
      <NavAccountTriggerWrap $open={open}>
        {trigger({
          open,
          toggle: () => setOpen((prev) => !prev),
        })}
      </NavAccountTriggerWrap>

      {open && (
        <NavAccountDropdown role="menu" aria-label={t("nav.profileMenu")}>
          {profileAction(closeMenu)}
          <NavAccountMenuDivider />
          <NavAccountMenuButton
            type="button"
            role="menuitem"
            onClick={handleLogout}
            disabled={isPending}
          >
            <NavAccountMenuIcon aria-hidden>
              <LogoutIcon width={18} height={18} />
            </NavAccountMenuIcon>
            {t("nav.logout")}
          </NavAccountMenuButton>
        </NavAccountDropdown>
      )}
    </NavAccountHost>
  );
};

const CreatorHeaderRight = ({
  initial,
  email,
  avatarUrl,
}: {
  initial: string;
  email: string;
  avatarUrl: string | null;
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
      <AccountMenu
        trigger={({ open, toggle }) => (
          <RightProfileWrapper
            type="button"
            aria-label={t("common.creatorProfile")}
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={toggle}
          >
            <ProfileCircle>
              {avatarUrl ? (
                <ProfileAvatarImage
                  src={avatarUrl}
                  alt={t("common.creatorProfile")}
                />
              ) : (
                <InitialAvatar>{initial}</InitialAvatar>
              )}
            </ProfileCircle>
            <EmailWrapper>
              <MonoText $use="Body_Medium">{email}</MonoText>
            </EmailWrapper>
          </RightProfileWrapper>
        )}
        profileAction={(closeMenu) => (
          <NavAccountMenuItem
            href={PATHS.DASHBOARD_CREATOR_PROFILE}
            role="menuitem"
            onClick={closeMenu}
          >
            <NavAccountMenuIcon aria-hidden>
              <ProfileIcon width={18} height={18} />
            </NavAccountMenuIcon>
            {t(NAV.accountProfile)}
          </NavAccountMenuItem>
        )}
      />
    </>
  );
};

const ViewerHeaderRight = ({
  initial,
  avatarUrl,
  onProfileClick,
}: {
  initial: string;
  avatarUrl: string | null;
  onProfileClick?: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <AccountMenu
      trigger={({ open, toggle }) => (
        <ProfileButton
          type="button"
          aria-label={t("common.viewerProfile")}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={toggle}
        >
          {avatarUrl ? (
            <ProfileAvatarImage
              src={avatarUrl}
              alt={t("common.viewerProfile")}
            />
          ) : (
            initial
          )}
        </ProfileButton>
      )}
      profileAction={(closeMenu) => (
        <NavAccountMenuButton
          type="button"
          role="menuitem"
          onClick={() => {
            closeMenu();
            onProfileClick?.();
          }}
        >
          <NavAccountMenuIcon aria-hidden>
            <ProfileIcon width={18} height={18} />
          </NavAccountMenuIcon>
          {t(NAV.accountProfile)}
        </NavAccountMenuButton>
      )}
    />
  );
};

export default DashboardHeader;
