"use client";

import { useTranslation } from "react-i18next";
import {
  Container,
  Top,
  Column,
  Title,
  LogoRow,
  LinkItem,
  Bottom,
  IconRow,
  BottomLeft,
  BottomRight,
  Divider,
  CardWrapper,
  LinkRow,
  BottomLink,
} from "./styles";
import logo from "../../../assets/images/kiibee-logo.svg";
import card from "../../../assets/images/card.png";
import { FacebookIcon } from "@/assets/icons/facebookIcon";
import { TwitterIcon } from "@/assets/icons/twitterIcon";
import { YouTubeIcon } from "@/assets/icons/youTubeIcon";
import { footerConfig } from "@/utils/footerConfig";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <Container>
      <Top>
        <Column>
          <LogoRow>
            <img src={logo.src ?? logo} alt={t("nav.logoAlt")} />
          </LogoRow>
          <IconRow>
            <FacebookIcon />
            <TwitterIcon />
            <YouTubeIcon />
          </IconRow>
        </Column>

        {footerConfig.map((col) => (
          <Column key={col.title}>
            <Title>
              <MonoText $use="H5_Medium" color={COLORS.primary.WHITE}>
                {t(col.title)}
              </MonoText>
            </Title>
            {col.items.map((item, idx) => (
              <LinkItem key={`${col.title}-${idx}`} href={item.href ?? "#"}>
                <MonoText $use="Body_Medium" color={COLORS.primary.WHITE}>
                  {t(item.label)}
                </MonoText>
              </LinkItem>
            ))}
          </Column>
        ))}
      </Top>
      <Divider />

      <Bottom>
        <BottomLeft>{t("footer.copyright", { year })}</BottomLeft>
        <BottomRight>
          <LinkRow>
            <BottomLink href="/privacy-policy">
              <MonoText $use="Body_Medium" color={COLORS.primary.WHITE}>
                {t("footer.privacyPolicy")}
              </MonoText>
            </BottomLink>
            <BottomLink href="/terms-of-service">
              <MonoText $use="Body_Medium" color={COLORS.primary.WHITE}>
                {t("footer.termsOfService")}
              </MonoText>
            </BottomLink>
            <BottomLink href="/cookie-settings">
              <MonoText $use="Body_Medium" color={COLORS.primary.WHITE}>
                {t("footer.cookieSettings")}
              </MonoText>
            </BottomLink>
          </LinkRow>
          <CardWrapper>
            <img src={card.src ?? card} alt={t("nav.logoAlt")} />
          </CardWrapper>
        </BottomRight>
      </Bottom>
    </Container>
  );
};

export default Footer;
