"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
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

export default function NavBar() {
  const { t } = useTranslation();
  const [active, setActive] = React.useState<string | null>(null);
  const [pinned, setPinned] = React.useState<string | null>(null);
  const navRef = React.useRef<HTMLElement | null>(null);

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
    <Header>
      <Inner>
        <Left>
          <Logo>
            <Image
              src={logo}
              alt={t("nav.logoAlt")}
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
          <GenericButton asAnchor href="/auth/login" variant="secondary">
            {t("nav.login")}
          </GenericButton>
          <GenericButton asAnchor href="/auth/signup" variant="primary">
            {t("nav.startCreating")}
          </GenericButton>
        </Actions>
      </Inner>
    </Header>
  );
}
