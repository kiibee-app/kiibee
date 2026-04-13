"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import {
  Container,
  Inner,
  Left,
  Right,
  Content,
  Title,
  Subtitle,
  CTAWrap,
  CardsWrap,
  BackCard,
  FrontCard,
  AccountText,
  LoginLink,
} from "./styles";
import GenericButton from "../../../UI/GenericButton";
import mediaCard1 from "../../../../assets/images/auth/mediaCard1.png";
import mediaCard2 from "../../../../assets/images/auth/mediaCard2.png";
import { MonoText } from "@/components/UI/Monotext";

export default function SignUpSection() {
  const { t } = useTranslation();

  return (
    <Container>
      <Inner>
        <Left>
          <Content>
            <Title>
              <MonoText $use="H4_Medium">{t("auth.title")}</MonoText>
            </Title>
            <Subtitle>
              <MonoText $use="Body_Regular">{t("auth.subtitle")}</MonoText>
            </Subtitle>

            <CTAWrap>
              <GenericButton
                asAnchor
                href="/auth/signup-creator"
                variant="primary"
              >
                {t("auth.signupCreator")}
              </GenericButton>
              <GenericButton
                asAnchor
                href="/auth/signup-viewer"
                variant="secondary"
              >
                {t("auth.signupViewer")}
              </GenericButton>
            </CTAWrap>

            <AccountText>
              <MonoText $use="Body_Medium">
                {t("auth.alreadyHaveAccount")}
              </MonoText>
              <LoginLink href="/auth/login">
                <MonoText $use="Body_Medium">{t("auth.login")} </MonoText>
              </LoginLink>
            </AccountText>
          </Content>
        </Left>
        <Right>
          <CardsWrap>
            <BackCard>
              <Image
                src={mediaCard1}
                alt={t("auth.mediaCard1Alt")}
                priority
                style={{ width: "100%", height: "auto" }}
              />
            </BackCard>
            <FrontCard>
              <Image
                src={mediaCard2}
                alt={t("auth.mediaCard2Alt")}
                priority
                style={{ width: "100%", height: "auto" }}
              />
            </FrontCard>
          </CardsWrap>
        </Right>
      </Inner>
    </Container>
  );
}
