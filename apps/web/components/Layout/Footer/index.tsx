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
} from "./styles";
import logo from "../../../assets/images/kiibee-logo.svg";
import card from "../../../assets/images/card.png";
import { FacebookIcon } from "@/assets/icons/facebookIcon";
import { TwitterIcon } from "@/assets/icons/twitterIcon";
import { YouTubeIcon } from "@/assets/icons/youTubeIcon";
import { footerConfig } from "@/utils/footerConfig";

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
            <Title>{t(col.title)}</Title>
            {col.items.map((item, idx) => (
              <LinkItem key={`${col.title}-${idx}`} href={item.href ?? "#"}>
                {t(item.label)}
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
            <span>{t("footer.privacyPolicy")}</span>
            <span>{t("footer.termsOfService")}</span>
            <span>{t("footer.cookieSettings")}</span>
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
