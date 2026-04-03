"use client";

import Image from "next/image";
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
import logo from "../../../assets/images/logo.png";
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
            <Image
              src={logo}
              alt={t("nav.logoAlt")}
              width={90}
              height={28}
              priority
            />
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
            {col.items.map((item, idx) =>
              item.href ? (
                <LinkItem key={`${col.title}-${idx}`} href={item.href}>
                  {t(item.label)}
                </LinkItem>
              ) : (
                <span key={`${col.title}-${idx}`}>{t(item.label)}</span>
              ),
            )}
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
            <Image
              src={card}
              alt={t("nav.logoAlt")}
              width={200}
              height={60}
              priority
            />
          </CardWrapper>
        </BottomRight>
      </Bottom>
    </Container>
  );
};

export default Footer;
