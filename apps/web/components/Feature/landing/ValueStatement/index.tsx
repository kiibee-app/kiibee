"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Section, Inner, Content, Title, Background, Subtitle } from "./styles";
import Image from "next/image";
import valueBg from "../../../assets/images/cta-buttom.png";
import GenericButton from "../../../UI/GenericButton";

export default function ValueStatement() {
  const { t } = useTranslation();

  return (
    <Section>
      <Background>
        <Image
          src={valueBg}
          alt={t("value.bgAlt")}
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </Background>

      <Inner>
        <Content>
          <Title>{t("value.title")}</Title>
          <Subtitle>{t("value.subtitle")}</Subtitle>
          <GenericButton asAnchor href="#" variant="primary-lite">
            {t("value.cta")}
          </GenericButton>
        </Content>
      </Inner>
    </Section>
  );
}
