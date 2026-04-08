"use client";

import React from "react";
import Image from "next/image";
import {
  Section,
  Inner,
  ImgWrap,
  Content,
  Title,
  Text,
  CTAWrap,
} from "./styles";
import heroImg from "../../../../assets/images/steps/cameraman.png";
import GenericButton from "@/components/UI/GenericButton";
import { useTranslation } from "react-i18next";
import { MonoText } from "@/components/UI/Monotext";

export default function CustomerSection() {
  const { t } = useTranslation();

  return (
    <Section>
      <Inner>
        <ImgWrap>
          <Image
            src={heroImg}
            alt={t("how.customerAlt")}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 50vw"
            loading="eager"
            style={{ objectFit: "cover" }}
          />
        </ImgWrap>

        <Content>
          <Title>
            <MonoText $use="Heading2">{t("how.customerTitle")}</MonoText>
          </Title>
          <Text>{t("how.customerLead")}</Text>
          <Text>{t("how.customerBody")}</Text>

          <CTAWrap>
            <GenericButton asAnchor href="#" variant="primary">
              {t("how.customerCta")}
            </GenericButton>
          </CTAWrap>
        </Content>
      </Inner>
    </Section>
  );
}
