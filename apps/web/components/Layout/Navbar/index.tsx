"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";
import { Header, Inner, Left, Logo, Nav, Actions } from "./styles";
import NAV_ITEMS from "@/utils/navItems";
import logo from "../../../assets/images/kiibee-wordmark.png";
import GenericButton from "@/components/UI/GenericButton";

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
          {NAV_ITEMS.map((item) => (
            <Link key={item.key} href={item.href}>
              {t(item.key)}
            </Link>
          ))}
        </Nav>

        <Actions>
          <GenericButton asAnchor href="/login" variant="secondary">
            {t("nav.login")}
          </GenericButton>
          <GenericButton asAnchor href="/sign-up" variant="primary">
            {t("nav.startCreating")}
          </GenericButton>
        </Actions>
      </Inner>
    </Header>
  );
}
