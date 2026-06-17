"use client";

import React, {
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { DASHBOARD, NAV } from "@/utils/translationKeys";
import Image from "@/components/UI/SafeImage";
import Link from "next/link";
import {
  Header,
  Inner,
  Left,
  Logo,
  Nav,
  Actions,
  ActionsPlaceholder,
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
  HamburgerButton,
  HamburgerLine,
  DrawerOverlay,
  DrawerPanel,
  DrawerContent,
  DrawerMenu,
  DrawerMenuItem,
  DrawerMenuLink,
  DrawerMenuButton,
  DrawerSubMenu,
  DrawerSubMenuColumn,
  DrawerSubMenuTitle,
  DrawerSubMenuLink,
} from "./styles";
import NAV_ITEMS from "@/utils/navItems";
import logo from "@/assets/images/kiibee-wordmark.webp";
import GenericButton from "@/components/UI/GenericButton";
import { MonoText } from "@/components/UI/Monotext";
import { CLICK } from "@/utils/common";
import {
  POINTER_DOWN,
  VARIANT,
  TONE_DARK,
  TONE_LIGHT,
} from "@/utils/Constants";
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
import { readStoredLoginUser } from "@/hooks/auth/useLogin";
import { getAvatarUrl } from "@/utils/creatorProfile";
import { useClickOutside } from "@/hooks/useClickOutside";
import { HomeIcon } from "@/assets/icons/homeIcon";
import { LogoutIcon } from "@/assets/icons/logoutIcon";
import { ArrowIcon } from "@/assets/icons";
import { Directions, isBrowser } from "@/utils/ui";
import {
  InitialAvatar,
  ProfileAvatarImage,
  ProfileButton,
} from "@/components/Layout/DashboardHeader/styles";

const NAVBAR_DEFAULTS = {
  position: "fixed",
  topOffset: "0px",
  navPosition: "center",
  navTextTone: TONE_DARK,
} satisfies Pick<
  NavBarProps,
  "position" | "topOffset" | "navPosition" | "navTextTone"
>;

const NAV_LINK_FALLBACK_HREF = "#";
const MEGA_CLOSE_DELAY_MS = 120;
const MEGA_UNMOUNT_DELAY_MS = 240;
const NAV_FORMAT_COLUMN_KEY = "format";
const NAV_TWO_COLUMN_CLASS_NAME = "twoCol";

const LOGO_BASE_STYLE = {
  width: "auto",
  height: "auto",
  maxHeight: 72,
} satisfies CSSProperties;

const LOGO_FILTER_BY_TONE = {
  [TONE_DARK]: "none",
  [TONE_LIGHT]: "brightness(0) invert(1)",
} satisfies Record<typeof TONE_DARK | typeof TONE_LIGHT, string>;

const getItemHref = (item: NavBarItem) => item.href ?? NAV_LINK_FALLBACK_HREF;

const isFormatColumn = (titleKey: string) =>
  titleKey.toLowerCase().includes(NAV_FORMAT_COLUMN_KEY);

type SidebarState = {
  pathname: string;
  expanded: boolean;
};

function NavAccountMenu({ dashboardPath }: { dashboardPath: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const userFromHook = useStoredLoginUser();
  const avatarUrlFromHook = useLoginUserAvatar();
  const { logout, isPending } = useLogout();
  const [open, setOpen] = useState(false);
  const [failedAvatarUrl, setFailedAvatarUrl] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const user = userFromHook || (isBrowser ? readStoredLoginUser() : null);
  const avatarUrl = avatarUrlFromHook || getAvatarUrl(user?.avatarUrl);

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
  position = NAVBAR_DEFAULTS.position,
  topOffset = NAVBAR_DEFAULTS.topOffset,
  navbarHeight,
  innerPadding,
  tabletInnerPadding,
  mobileInnerPadding,
  innerMaxWidth,
  navPosition = NAVBAR_DEFAULTS.navPosition,
  navTextTone = NAVBAR_DEFAULTS.navTextTone,
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
  const [openMegaKey, setOpenMegaKey] = useState<string | null>(null);
  const [renderedMegaKey, setRenderedMegaKey] = useState<string | null>(null);
  const activeItem = items.find(
    (item) => item.children && renderedMegaKey === item.key,
  );
  const [sidebarState, setSidebarState] = useState<SidebarState>({
    pathname,
    expanded: false,
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => {
      cancelAnimationFrame(handle);
    };
  }, []);
  const [mobileOpenSubKeys, setMobileOpenSubKeys] = useState<
    Record<string, boolean>
  >({});
  const sidebarExpanded =
    sidebarState.pathname === pathname && sidebarState.expanded;
  const toggleSidebar = () => {
    setSidebarState((prev) => ({
      pathname,
      expanded: prev.pathname === pathname ? !prev.expanded : true,
    }));
  };
  const collapseSidebar = () => {
    setSidebarState({ pathname, expanded: false });
  };

  const toggleMobileSubMenu = (key: string) => {
    setMobileOpenSubKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const routeActiveKey = useMemo(() => {
    if (!routeActiveItems) return null;
    const explicit = items.find((item) => item.isActive)?.key;
    if (explicit) return explicit;
    return findActiveNavItemKey(pathname, items);
  }, [items, pathname, routeActiveItems]);
  const navRef = useRef<HTMLElement | null>(null);
  const actionsRef = useRef<HTMLDivElement | null>(null);
  const megaMenuRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const unmountTimerRef = useRef<number | null>(null);
  const innerStyle = useMemo(() => {
    const style: CSSProperties & Record<string, string> = {};

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
  const logoStyle = useMemo(
    () => ({
      ...LOGO_BASE_STYLE,
      filter: LOGO_FILTER_BY_TONE[navTextTone],
    }),
    [navTextTone],
  );

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
    }, MEGA_UNMOUNT_DELAY_MS);
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
    }, MEGA_CLOSE_DELAY_MS);
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
        !actionsRef.current?.contains(target) &&
        !megaMenuRef.current?.contains(target)
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

  const isMegaOpen = Boolean(openMegaKey);
  const getRouteActiveState = (item: NavBarItem) =>
    item.isActive ?? item.key === routeActiveKey;

  const renderRouteNavItem = (item: NavBarItem) => {
    const isRouteActive = getRouteActiveState(item);

    return item.onClick ? (
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
        href={getItemHref(item)}
        scroll={false}
        $isActive={isRouteActive}
        $textTone={navTextTone}
        aria-current={isRouteActive ? "page" : undefined}
      >
        {renderItemLabel(item)}
      </NavAnchor>
    );
  };

  const renderDefaultNavItem = (item: NavBarItem) =>
    item.onClick ? (
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          item.onClick?.();
        }}
      >
        {renderItemLabel(item)}
      </button>
    ) : (
      <Link href={getItemHref(item)}>{renderItemLabel(item)}</Link>
    );

  const renderDrawerSubMenu = (item: NavBarItem, open: boolean) =>
    open && item.children ? (
      <DrawerSubMenu>
        {item.children.map((col) => (
          <DrawerSubMenuColumn key={col.titleKey}>
            <DrawerSubMenuTitle>{t(col.titleKey)}</DrawerSubMenuTitle>
            {col.items.map((ci) => (
              <DrawerSubMenuLink
                key={ci.key}
                href={ci.href}
                $isActive={pathname === ci.href}
                onClick={collapseSidebar}
              >
                {t(ci.key)}
              </DrawerSubMenuLink>
            ))}
          </DrawerSubMenuColumn>
        ))}
      </DrawerSubMenu>
    ) : null;

  const renderDrawerItem = (item: NavBarItem) => {
    const isRouteActive = routeActiveItems && getRouteActiveState(item);
    const isSubMenuOpen = Boolean(mobileOpenSubKeys[item.key]);

    if (item.children?.length) {
      return (
        <>
          <DrawerMenuButton
            type="button"
            $isActive={isRouteActive}
            $expanded={isSubMenuOpen}
            onClick={() => toggleMobileSubMenu(item.key)}
          >
            {renderItemLabel(item)}
            <ArrowIcon
              direction={isSubMenuOpen ? Directions.UP : Directions.DOWN}
            />
          </DrawerMenuButton>
          {renderDrawerSubMenu(item, isSubMenuOpen)}
        </>
      );
    }

    return item.onClick ? (
      <DrawerMenuButton
        type="button"
        $isActive={isRouteActive}
        onClick={() => {
          item.onClick?.();
          collapseSidebar();
        }}
      >
        {renderItemLabel(item)}
      </DrawerMenuButton>
    ) : (
      <DrawerMenuLink
        href={getItemHref(item)}
        $isActive={isRouteActive}
        onClick={collapseSidebar}
      >
        {renderItemLabel(item)}
      </DrawerMenuLink>
    );
  };

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
          <HamburgerButton
            type="button"
            $textTone={navTextTone}
            onClick={toggleSidebar}
            aria-label={t(DASHBOARD.toggleSidebar)}
          >
            <HamburgerLine $textTone={navTextTone} />
            <HamburgerLine $textTone={navTextTone} />
            <HamburgerLine $textTone={navTextTone} />
          </HamburgerButton>
          {brand ?? (
            <Logo>
              <Link href={PATHS.HOME}>
                <Image
                  src={logo}
                  alt={t(NAV.logoAlt)}
                  width={320}
                  height={98}
                  priority
                  style={logoStyle}
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
              {items.map((item) => (
                <NavItemWrapper key={item.key}>
                  {renderRouteNavItem(item)}
                </NavItemWrapper>
              ))}
            </>
          ) : (
            <MonoText $use="Body_Medium">
              {items.map((item) => (
                <NavItemWrapper
                  key={item.key}
                  onMouseEnter={() => handleNavItemMouseEnter(item)}
                >
                  {renderDefaultNavItem(item)}
                </NavItemWrapper>
              ))}
            </MonoText>
          )}
          {navAfter}
        </Nav>

        <Actions ref={actionsRef} $textTone={navTextTone}>
          {!isMounted ? (
            actions ? (
              actions
            ) : (
              <ActionsPlaceholder />
            )
          ) : isLoggedIn && dashboardPath ? (
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

      {!routeActiveItems && activeItem && activeItem.children && (
        <MegaMenu
          ref={megaMenuRef}
          $textTone={navTextTone}
          $isOpen={openMegaKey === activeItem.key}
          onMouseEnter={clearCloseTimer}
          onMouseLeave={scheduleCloseMenu}
        >
          <MegaInner $isOpen={openMegaKey === activeItem.key}>
            {activeItem.children.map((col) => (
              <MegaColumn
                key={col.titleKey}
                className={
                  isFormatColumn(col.titleKey)
                    ? NAV_TWO_COLUMN_CLASS_NAME
                    : undefined
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

      <DrawerOverlay $open={sidebarExpanded} onClick={collapseSidebar} />
      <DrawerPanel $open={sidebarExpanded}>
        <DrawerContent>
          <DrawerMenu>
            {items.map((item) => (
              <DrawerMenuItem key={item.key}>
                {renderDrawerItem(item)}
              </DrawerMenuItem>
            ))}
          </DrawerMenu>
        </DrawerContent>
      </DrawerPanel>
    </Header>
  );
}
