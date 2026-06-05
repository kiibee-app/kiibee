"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  NavAnchor,
  NavButton,
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
import { CLICK } from "@/utils/common";
import { POINTER_DOWN, VARIANT, TONE_DARK } from "@/utils/Constants";
import { PATHS } from "@/utils/path";
import type { NavBarItem, NavBarProps } from "@/utils/profile";
import { findActiveNavItemKey } from "@/utils/creatorChannel";
import { useSessionDashboardPath } from "@/hooks/auth/useSessionDashboardPath";
import { useLogout } from "@/hooks/auth/useLogout";
import {
  getLoginUserFirstLetter,
  useLoginUserAvatar,
  useStoredLoginUser,
} from "@/hooks/auth/useStoredLoginUser";
import { useClickOutside } from "@/hooks/useClickOutside";
import { HomeIcon } from "@/assets/icons/homeIcon";
import { LogoutIcon } from "@/assets/icons/logoutIcon";
import {
  InitialAvatar,
  ProfileAvatarImage,
  ProfileButton,
} from "@/components/Layout/DashboardHeader/styles";

function NavAccountMenu({ dashboardPath }: { dashboardPath: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useStoredLoginUser();
  const avatarUrl = useLoginUserAvatar();
  const { logout, isPending } = useLogout();
  const [open, setOpen] = useState(false);
  const [failedAvatarUrl, setFailedAvatarUrl] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstLetter = getLoginUserFirstLetter(user);
  const showAvatar = Boolean(avatarUrl) && avatarUrl !== failedAvatarUrl;

  useClickOutside({
    ref: menuRef,
    enabled: open,
    eventType: CLICK,
    handler: () => setOpen(false),
  });

  const handleDashboard = () => {
    setOpen(false);
    router.push(dashboardPath);
  };

  const handleLogout = () => {
    if (isPending) return;
    setOpen(false);
    void logout();
  };

  return (
    <NavAccountHost ref={menuRef} $open={open}>
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
            onClick={(event) => {
              event.preventDefault();
              handleDashboard();
            }}
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
  routeActiveItems = false,
}: NavBarProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const dashboardPath = useSessionDashboardPath();
  const isLoggedIn = Boolean(dashboardPath);
  const loginButtonHref = PATHS.AUTH_LOGIN;
  const renderItemLabel = (item: NavBarItem) => item.label ?? t(item.key);
  const [openMegaKey, setOpenMegaKey] = React.useState<string | null>(null);
  const [renderedMegaKey, setRenderedMegaKey] = React.useState<string | null>(
    null,
  );
  const routeActiveKey = React.useMemo(() => {
    if (!routeActiveItems) return null;
    const explicit = items.find((item) => item.isActive)?.key;
    if (explicit) return explicit;
    return findActiveNavItemKey(pathname, items);
  }, [items, pathname, routeActiveItems]);
  const navRef = React.useRef<HTMLElement | null>(null);
  const actionsRef = React.useRef<HTMLDivElement | null>(null);
  const closeTimerRef = React.useRef<number | null>(null);
  const unmountTimerRef = React.useRef<number | null>(null);
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

  const clearCloseTimer = useCallback(() => {
    if (!closeTimerRef.current) return;
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }, []);

  const clearUnmountTimer = useCallback(() => {
    if (!unmountTimerRef.current) return;
    window.clearTimeout(unmountTimerRef.current);
    unmountTimerRef.current = null;
  }, []);

  const closeMenu = useCallback(() => {
    clearCloseTimer();
    clearUnmountTimer();
    setOpenMegaKey(null);
    unmountTimerRef.current = window.setTimeout(() => {
      setRenderedMegaKey(null);
      unmountTimerRef.current = null;
    }, 240);
  }, [clearCloseTimer, clearUnmountTimer]);

  const openMenu = useCallback(
    (key: string) => {
      clearCloseTimer();
      clearUnmountTimer();
      setRenderedMegaKey(key);
      setOpenMegaKey(key);
    },
    [clearCloseTimer, clearUnmountTimer],
  );

  const scheduleCloseMenu = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      closeMenu();
      closeTimerRef.current = null;
    }, 120);
  }, [clearCloseTimer, closeMenu]);

  const handleNavItemMouseEnter = useCallback(
    (item: NavBarItem) => {
      if (item.children) {
        openMenu(item.key);
        return;
      }

      closeMenu();
    },
    [closeMenu, openMenu],
  );

  const handleGlobalClick = useCallback(
    (e: PointerEvent) => {
      const target = e.target as Node | null;

      if (
        !navRef.current?.contains(target) &&
        !actionsRef.current?.contains(target)
      ) {
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

  useEffect(
    () => () => {
      clearCloseTimer();
      clearUnmountTimer();
    },
    [clearCloseTimer, clearUnmountTimer],
  );

  const isMegaOpen = items.some(
    (item) => item.children && openMegaKey === item.key,
  );

  return (
    <Header
      $position={position}
      $topOffset={topOffset}
      $navbarHeight={navbarHeight}
      $isMegaOpen={isMegaOpen}
      onMouseEnter={clearCloseTimer}
      onMouseLeave={scheduleCloseMenu}
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

        <Nav
          ref={navRef}
          $navPosition={navPosition}
          $textTone={navTextTone}
          $routeActiveItems={routeActiveItems}
        >
          {navBefore}
          {routeActiveItems ? (
            <>
              {items.map((item) => {
                const isRouteActive =
                  item.isActive ?? item.key === routeActiveKey;
                return (
                  <NavItemWrapper key={item.key}>
                    {item.onClick ? (
                      <NavButton
                        type="button"
                        $isActive={isRouteActive}
                        $textTone={navTextTone}
                        aria-current={isRouteActive ? "page" : undefined}
                        onClick={() => item.onClick?.()}
                      >
                        {renderItemLabel(item)}
                      </NavButton>
                    ) : (
                      <NavAnchor
                        href={item.href || "#"}
                        scroll={false}
                        $isActive={isRouteActive}
                        $textTone={navTextTone}
                        aria-current={isRouteActive ? "page" : undefined}
                      >
                        {renderItemLabel(item)}
                      </NavAnchor>
                    )}
                  </NavItemWrapper>
                );
              })}
            </>
          ) : (
            <MonoText $use="Body_Medium">
              {items.map((item) => (
                <NavItemWrapper
                  key={item.key}
                  onMouseEnter={() => handleNavItemMouseEnter(item)}
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

                  {item.children && renderedMegaKey === item.key && (
                    <MegaMenu
                      $isOpen={openMegaKey === item.key}
                      onMouseEnter={clearCloseTimer}
                      onMouseLeave={scheduleCloseMenu}
                    >
                      <MegaInner $isOpen={openMegaKey === item.key}>
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
          )}
          {navAfter}
        </Nav>

        <Actions ref={actionsRef} $textTone={navTextTone}>
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
