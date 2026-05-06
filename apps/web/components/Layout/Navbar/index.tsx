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

export default function NavBar() {
  const { t } = useTranslation();
  const [active, setActive] = React.useState<string | null>(null);
  const [pinned, setPinned] = React.useState<string | null>(null);
  const navRef = React.useRef<HTMLElement | null>(null);

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

  return (
    <Header>
      <Inner>
        <Left>
          <Logo>
            <Image
              src={logo}
              alt={t(NAV.logoAlt)}
              width={80}
              height={25}
              priority
              style={{ width: "auto", height: "auto" }}
            />
          </Logo>
        </Left>

        <Nav ref={navRef}>
          <MonoText $use="Body_Medium">
            {NAV_ITEMS.map((item) => (
              <NavItemWrapper
                key={item.key}
                onMouseEnter={() => openMenu(item.key)}
                onClick={(e) => {
                  e.stopPropagation();
                  togglePin(item.key);
                }}
              >
                <Link href={item.href || "#"}>{t(item.key)}</Link>

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
        </Nav>

        <Actions>
          <GenericButton
            asAnchor
            href="/auth/login"
            variant={VARIANT.SECONDARY}
          >
            {t(NAV.login)}
          </GenericButton>
          <GenericButton asAnchor href="/auth/signup" variant={VARIANT.PRIMARY}>
            {t(NAV.startCreating)}
          </GenericButton>
        </Actions>
      </Inner>
    </Header>
  );
}
