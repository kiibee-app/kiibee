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

export default function SignUpSection() {
  const { t } = useTranslation();

  return (
    <Container>
      <Inner>
        <Left>
          <Content>
            <Title>
              {t("auth.title", "The place where creators and supporters meet")}
            </Title>
            <Subtitle>
              {t(
                "auth.subtitle",
                "Creators earn by sharing content. Viewers discover and support the work they love. Join a community where creativity thrives on both sides.",
              )}
            </Subtitle>

            <CTAWrap>
              <GenericButton
                asAnchor
                href="/auth/signup-creator"
                variant="primary"
              >
                {t("auth.signupCreator", "Sign up as a creator")}
              </GenericButton>
              <GenericButton asAnchor href="#" variant="secondary">
                {t("auth.signupViewer", "Sign up as a viewer")}
              </GenericButton>
            </CTAWrap>

            <AccountText>
              {t("auth.haveAccount", "Already have an account?")}{" "}
              <LoginLink href="#">{t("auth.login", "Log in")}</LoginLink>
            </AccountText>
          </Content>
        </Left>

        <Right>
          <CardsWrap>
            <BackCard>
              <Image
                src={mediaCard1}
                alt={t("auth.mediaCard1Alt", "Creator media card")}
                priority
                style={{ width: "100%", height: "auto" }}
              />
            </BackCard>
            <FrontCard>
              <Image
                src={mediaCard2}
                alt={t("auth.mediaCard2Alt", "Creator recipes media card")}
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
