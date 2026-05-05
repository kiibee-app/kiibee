"use client";

import React from "react";
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
import { VARIANT } from "@/utils/Constants";
import type { NavBarProps } from "@/utils/profile";

export default function NavBar({
  position = "fixed",
  topOffset = "0px",
  innerPadding,
  tabletInnerPadding,
  mobileInnerPadding,
  innerMaxWidth,
  navPosition = "center",
  items = NAV_ITEMS,
  brand,
  navBefore,
  navAfter,
  actions,
}: NavBarProps) {
  const { t } = useTranslation();
  const [active, setActive] = React.useState<string | null>(null);
  const [pinned, setPinned] = React.useState<string | null>(null);
  const navRef = React.useRef<HTMLElement | null>(null);
  const innerStyle = React.useMemo(() => {
    const style: React.CSSProperties & Record<string, string> = {};

    style["--navbar-top-offset"] = topOffset;

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
    innerMaxWidth,
    innerPadding,
    mobileInnerPadding,
    tabletInnerPadding,
    topOffset,
  ]);

  React.useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!navRef.current) return;
      if (target && !navRef.current.contains(target)) {
        setPinned(null);
        setActive(null);
      }
    };

    document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  }, []);

  return (
    <Header $position={position} $topOffset={topOffset}>
      <Inner style={innerStyle}>
        <Left>
          {brand ?? (
            <Logo>
              <Link href="/">
                <Image
                  src={logo}
                  alt={t(NAV.logoAlt)}
                  width={80}
                  height={25}
                  priority
                  style={{ width: "auto", height: "auto" }}
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
                onMouseEnter={() => {
                  setActive(item.key);
                  setPinned(item.key);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (pinned === item.key) {
                    setPinned(null);
                    setActive(null);
                  } else {
                    setPinned(item.key);
                    setActive(item.key);
                  }
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
          {actions ?? (
            <>
              <GenericButton
                asAnchor
                href="/auth/login"
                variant={VARIANT.SECONDARY}
              >
                {t(NAV.login)}
              </GenericButton>
              <GenericButton
                asAnchor
                href="/auth/signup"
                variant={VARIANT.PRIMARY}
              >
                {t(NAV.startCreating)}
              </GenericButton>
            </>
          )}
        </Actions>
      </Inner>
    </Header>
  );
}
