"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Section, Inner, Content, Title, Background, Subtitle } from "./styles";
import Image from "next/image";
import valueBg from "../../../assets/images/CTA buttom.png";
import GenericButton from "../../UI/GenericButton";

export default function ValueStatement() {
  const { t } = useTranslation();

  return (
    <Section>
      <Background>
        <Image
          src={valueBg}
          alt="Value background"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </Background>

      <Inner>
        <Content>
          <Title>
            {t("value.title", {
              defaultValue: "What you know is worth something",
            })}
          </Title>
          <Subtitle>Turn expertise into earnings</Subtitle>
          <GenericButton asAnchor href="#" variant="primary-lite">
            {t("value.cta", { defaultValue: "Join kiibee today" })}
          </GenericButton>
        </Content>
      </Inner>
    </Section>
  );
}
