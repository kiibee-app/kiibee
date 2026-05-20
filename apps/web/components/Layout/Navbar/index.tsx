"use client";

import React, { useCallback, useEffect } from "react";
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
} from "./styles";
import NAV_ITEMS from "@/utils/navItems";
import logo from "@/assets/images/kiibee-wordmark.webp";
import GenericButton from "@/components/UI/GenericButton";
import { MonoText } from "@/components/UI/Monotext";
import { POINTER_DOWN, VARIANT } from "@/utils/Constants";
import { PATHS } from "@/utils/path";
import type { NavBarProps } from "@/utils/profile";

export default function NavBar({
  position = "fixed",
  topOffset = "0px",
  navbarHeight,
  innerPadding,
  tabletInnerPadding,
  mobileInnerPadding,
  innerMaxWidth,
  navPosition = "center",
  items = NAV_ITEMS,
  brand,
  navBefore,
  navAfter,
}: NavBarProps) {
  const { t } = useTranslation();
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
                  }}
                />
              </Link>
            </Logo>
          )}
        </Left>

        <Nav ref={navRef} $navPosition={navPosition}>
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
                <Link href={item.href || "#"}>
                  {"label" in item && item.label ? item.label : t(item.key)}
                </Link>

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

        <Actions>
          <GenericButton
            asAnchor
            href={PATHS.AUTH_LOGIN}
            variant={VARIANT.SECONDARY}
          >
            {t(NAV.login)}
          </GenericButton>
          <GenericButton
            asAnchor
            href={PATHS.AUTH_SIGNUP}
            variant={VARIANT.PRIMARY}
          >
            {t(NAV.startCreating)}
          </GenericButton>
        </Actions>
      </Inner>
    </Header>
  );
}
