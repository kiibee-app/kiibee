"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { NAV } from "@/utils/translationKeys";
import Image from "@/components/UI/SafeImage";
import Link from "next/link";
import {
  Header,
  Inner,
  Left,
  Logo,
  Nav,
  Actions,
  NavItemWrapper,
  MegaMenu,
  MegaInner,
  MegaColumn,
  ColumnTitle,
  ColumnItem,
  NavAccountDropdown,
  NavAccountHost,
  NavAccountMenuButton,
  NavAccountMenuDivider,
  NavAccountMenuIcon,
  NavAccountMenuItem,
  NavAccountTriggerWrap,
} from "./styles";
import NAV_ITEMS from "@/utils/navItems";
import logo from "@/assets/images/kiibee-wordmark.webp";
import GenericButton from "@/components/UI/GenericButton";
import { MonoText } from "@/components/UI/Monotext";
import { POINTER_DOWN, VARIANT, TONE_DARK } from "@/utils/Constants";
import { PATHS } from "@/utils/path";
import type { NavBarItem, NavBarProps } from "@/utils/profile";
import { useSessionDashboardPath } from "@/hooks/auth/useSessionDashboardPath";
import { useLogout } from "@/hooks/auth/useLogout";
import {
  getLoginUserDisplayName,
  getLoginUserInitial,
  useLoginUserAvatar,
  useStoredLoginUser,
} from "@/hooks/auth/useStoredLoginUser";
import type { LoginUser } from "@/hooks/auth/useLogin";
import { useClickOutside } from "@/hooks/useClickOutside";
import { HomeIcon } from "@/assets/icons/homeIcon";
import { LogoutIcon } from "@/assets/icons/logoutIcon";
import {
  InitialAvatar,
  ProfileAvatarImage,
  ProfileButton,
} from "@/components/Layout/DashboardHeader/styles";

function getProfileFirstLetter(user: LoginUser | null) {
  const displayName = getLoginUserDisplayName(user);
  if (displayName) return displayName.trim().charAt(0).toUpperCase();

  const initial = getLoginUserInitial(user).trim();
  return initial.charAt(0).toUpperCase() || "?";
}

function NavAccountMenu({ dashboardPath }: { dashboardPath: string }) {
  const { t } = useTranslation();
  const user = useStoredLoginUser();
  const avatarUrl = useLoginUserAvatar();
  const { logout, isPending } = useLogout();
  const [open, setOpen] = useState(false);
  const [failedAvatarUrl, setFailedAvatarUrl] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstLetter = getProfileFirstLetter(user);
  const showAvatar = Boolean(avatarUrl) && avatarUrl !== failedAvatarUrl;

  useClickOutside({
    ref: menuRef,
    enabled: open,
    handler: () => setOpen(false),
  });

  const handleLogout = () => {
    if (isPending) return;
    setOpen(false);
    void logout();
  };

  return (
    <NavAccountHost ref={menuRef}>
      <NavAccountTriggerWrap $open={open}>
        <ProfileButton
          type="button"
          aria-label={t(NAV.profileMenu)}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          {showAvatar && avatarUrl ? (
            <ProfileAvatarImage
              src={avatarUrl}
              alt={t(NAV.profileMenu)}
              onError={() => setFailedAvatarUrl(avatarUrl)}
            />
          ) : (
            <InitialAvatar>{firstLetter}</InitialAvatar>
          )}
        </ProfileButton>
      </NavAccountTriggerWrap>

      {open && (
        <NavAccountDropdown role="menu" aria-label={t(NAV.profileMenu)}>
          <NavAccountMenuItem
            href={dashboardPath}
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <NavAccountMenuIcon aria-hidden>
              <HomeIcon width={18} height={18} />
            </NavAccountMenuIcon>
            {t(NAV.dashboard)}
          </NavAccountMenuItem>
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
            {t(NAV.logout)}
          </NavAccountMenuButton>
        </NavAccountDropdown>
      )}
    </NavAccountHost>
  );
}

export default function NavBar({
  position = "fixed",
  topOffset = "0px",
  navbarHeight,
  innerPadding,
  tabletInnerPadding,
  mobileInnerPadding,
  innerMaxWidth,
  navPosition = "center",
  navTextTone = TONE_DARK,
  items = NAV_ITEMS,
  brand,
  navBefore,
  navAfter,
  actions,
}: NavBarProps) {
  const { t } = useTranslation();
  const dashboardPath = useSessionDashboardPath();
  const isLoggedIn = Boolean(dashboardPath);
  const loginButtonHref = PATHS.AUTH_LOGIN;
  const renderItemLabel = (item: NavBarItem) => item.label ?? t(item.key);
  const [active, setActive] = React.useState<string | null>(null);
  const [pinned, setPinned] = React.useState<string | null>(null);
  const navRef = React.useRef<HTMLElement | null>(null);
  const innerStyle = React.useMemo(() => {
    const style: React.CSSProperties & Record<string, string> = {};

    style["--navbar-top-offset"] = topOffset;
    if (navbarHeight) {
      style["--navbar-height"] = navbarHeight;
    }

    if (innerPadding) {
      style["--navbar-inner-padding"] = innerPadding;
    }

    if (tabletInnerPadding) {
      style["--navbar-inner-tablet-padding"] = tabletInnerPadding;
    }

    if (mobileInnerPadding) {
      style["--navbar-inner-mobile-padding"] = mobileInnerPadding;
    }

    if (innerMaxWidth) {
      style["--navbar-inner-max-width"] = innerMaxWidth;
    }

    return style;
  }, [
    navbarHeight,
    innerMaxWidth,
    innerPadding,
    mobileInnerPadding,
    tabletInnerPadding,
    topOffset,
  ]);

  const closeMenu = useCallback(() => {
    setPinned(null);
    setActive(null);
  }, []);

  const openMenu = useCallback((key: string) => {
    setActive(key);
    setPinned(key);
  }, []);

  const togglePin = useCallback(
    (key: string) => {
      const shouldClose = pinned === key;
      if (shouldClose) {
        closeMenu();
        return;
      }
      openMenu(key);
    },
    [pinned, closeMenu, openMenu],
  );

  const handleGlobalClick = useCallback(
    (e: PointerEvent) => {
      const target = e.target as Node | null;

      if (!navRef.current?.contains(target)) {
        closeMenu();
      }
    },
    [closeMenu],
  );

  useEffect(() => {
    document.addEventListener(POINTER_DOWN, handleGlobalClick);
    return () => {
      document.removeEventListener(POINTER_DOWN, handleGlobalClick);
    };
  }, [handleGlobalClick]);

  const isMegaOpen = items.some((item) => item.children && active === item.key);

  return (
    <Header
      $position={position}
      $topOffset={topOffset}
      $navbarHeight={navbarHeight}
      $isMegaOpen={isMegaOpen}
    >
      <Inner style={innerStyle}>
        <Left>
          {brand ?? (
            <Logo>
              <Link href="/">
                <Image
                  src={logo}
                  alt={t(NAV.logoAlt)}
                  width={320}
                  height={98}
                  priority
                  style={{
                    width: "auto",
                    height: "auto",
                    maxHeight: 72,
                    filter:
                      navTextTone === "light"
                        ? "brightness(0) invert(1)"
                        : "none",
                  }}
                />
              </Link>
            </Logo>
          )}
        </Left>

        <Nav ref={navRef} $navPosition={navPosition} $textTone={navTextTone}>
          {navBefore}
          <MonoText $use="Body_Medium">
            {items.map((item) => (
              <NavItemWrapper
                key={item.key}
                onMouseEnter={() => openMenu(item.key)}
                onClick={(e) => {
                  e.stopPropagation();
                  togglePin(item.key);
                }}
              >
                {item.onClick ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      item.onClick?.();
                    }}
                  >
                    {renderItemLabel(item)}
                  </button>
                ) : (
                  <Link href={item.href || "#"}>{renderItemLabel(item)}</Link>
                )}

                {item.children && active === item.key && (
                  <MegaMenu>
                    <MegaInner>
                      {item.children.map((col) => (
                        <MegaColumn
                          key={col.titleKey}
                          className={
                            col.titleKey.toLowerCase().includes("format")
                              ? "twoCol"
                              : ""
                          }
                        >
                          <ColumnTitle>{t(col.titleKey)}</ColumnTitle>
                          {col.items.map((ci) => (
                            <ColumnItem key={ci.key} href={ci.href}>
                              {t(ci.key)}
                            </ColumnItem>
                          ))}
                        </MegaColumn>
                      ))}
                    </MegaInner>
                  </MegaMenu>
                )}
              </NavItemWrapper>
            ))}
          </MonoText>
          {navAfter}
        </Nav>

        <Actions $textTone={navTextTone}>
          {isLoggedIn && dashboardPath ? (
            <NavAccountMenu dashboardPath={dashboardPath} />
          ) : (
            (actions ?? (
              <>
                <GenericButton
                  className="login-btn"
                  asAnchor
                  href={loginButtonHref}
                  variant={VARIANT.SECONDARY}
                >
                  {t(NAV.login)}
                </GenericButton>
                <GenericButton
                  className="start-btn"
                  asAnchor
                  href={PATHS.AUTH_SIGNUP}
                  variant={VARIANT.PRIMARY}
                >
                  {t(NAV.startCreating)}
                </GenericButton>
              </>
            ))
          )}
        </Actions>
      </Inner>
    </Header>
  );
}
