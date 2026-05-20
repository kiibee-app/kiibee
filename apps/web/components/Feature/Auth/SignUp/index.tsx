"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { AUTH } from "@/utils/translationKeys";
import Image from "@/components/UI/SafeImage";
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
import mediaCard1 from "@/assets/images/auth/mediaCard1.webp";
import mediaCard2 from "@/assets/images/auth/mediaCard2.webp";
import { MonoText } from "@/components/UI/Monotext";
import { VARIANT } from "@/utils/Constants";
import { PATHS } from "@/utils/path";

export default function SignUpSection() {
  const { t } = useTranslation();

  return (
    <Container>
      <Inner>
        <Left>
          <Content>
            <Title>
              <MonoText $use="H4_Medium">{t(AUTH.title)}</MonoText>
            </Title>
            <Subtitle>
              <MonoText $use="Body_Regular">{t(AUTH.subtitle)}</MonoText>
            </Subtitle>

            <CTAWrap>
              <GenericButton
                asAnchor
                href={PATHS.AUTH_SIGNUP_CREATOR}
                variant={VARIANT.PRIMARY}
              >
                {t(AUTH.signupCreator)}
              </GenericButton>
              <GenericButton
                asAnchor
                href={PATHS.AUTH_SIGNUP_VIEWER}
                variant={VARIANT.SECONDARY}
              >
                {t(AUTH.signupViewer)}
              </GenericButton>
            </CTAWrap>

            <AccountText>
              <MonoText $use="Body_Medium">{t(AUTH.haveAccount)}</MonoText>
              <LoginLink href={PATHS.AUTH_LOGIN}>
                <MonoText $use="Body_Medium">{t(AUTH.login)} </MonoText>
              </LoginLink>
            </AccountText>
          </Content>
        </Left>
        <Right>
          <CardsWrap>
            <BackCard>
              <Image
                src={mediaCard1}
                alt={t(AUTH.mediaCard1Alt)}
                priority
                style={{ width: "100%", height: "auto" }}
              />
            </BackCard>
            <FrontCard>
              <Image
                src={mediaCard2}
                alt={t(AUTH.mediaCard2Alt)}
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
