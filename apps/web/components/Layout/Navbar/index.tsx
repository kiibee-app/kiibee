"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Image from "@/components/UI/SafeImage";
import Link from "next/link";
import { Header, Inner, Left, Logo, Nav, Actions } from "./styles";
import NAV_ITEMS from "@/utils/navItems";
import logo from "@/assets/images/kiibee-wordmark.webp";
import GenericButton from "@/components/UI/GenericButton";
import { MonoText } from "@/components/UI/Monotext";
import { VARIANT } from "@/utils/Constants";

export default function NavBar() {
  const { t } = useTranslation();

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

        <Nav>
          <MonoText $use="Body_Medium">
            {NAV_ITEMS.map((item) => (
              <Link key={item.key} href={item.href}>
                {t(item.key)}
              </Link>
            ))}
          </MonoText>
        </Nav>

        <Actions>
          <GenericButton
            asAnchor
            href="/auth/login"
            variant={VARIANT.SECONDARY}
          >
            {t("nav.login")}
          </GenericButton>
          <GenericButton asAnchor href="/auth/signup" variant={VARIANT.PRIMARY}>
            {t("nav.startCreating")}
          </GenericButton>
        </Actions>
      </Inner>
    </Header>
  );
}
