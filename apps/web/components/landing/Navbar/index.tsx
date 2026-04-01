"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { Header, Inner, Left, Logo, Nav, Actions } from "./styles";
import logo from "../../../assets/images/logo.png";
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
            />
          </Logo>
        </Left>

        <Nav>
          <a href="#">{t("nav.howItWorks")}</a>
          <a href="#">{t("nav.exploreCreators")}</a>
          <a href="#">{t("nav.about")}</a>
        </Nav>

        <Actions>
          <GenericButton asAnchor href="#" variant="secondary">
            {t("nav.login")}
          </GenericButton>
          <GenericButton asAnchor href="#" variant="primary">
            {t("nav.startCreating")}
          </GenericButton>
        </Actions>
      </Inner>
    </Header>
  );
}
