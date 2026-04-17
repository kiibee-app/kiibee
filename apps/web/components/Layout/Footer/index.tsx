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
import logo from "../../../assets/images/kiibee-logo.svg";
import card from "../../../assets/images/card.webp";
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
            <Image
              src={logo}
              alt={t("nav.logoAlt")}
              width={logo.width}
              height={logo.height}
              style={{ width: 90, height: "auto" }}
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
            <MonoText $use="Body_Medium" color={COLORS.primary.WHITE}>
              {t("footer.privacyPolicy")}
            </MonoText>
            <MonoText $use="Body_Medium" color={COLORS.primary.WHITE}>
              {t("footer.termsOfService")}
            </MonoText>
            <MonoText $use="Body_Medium" color={COLORS.primary.WHITE}>
              {t("footer.cookieSettings")}
            </MonoText>
          </LinkRow>
          <CardWrapper>
            <Image
              src={card}
              alt={t("footer.paymentMethodsAlt", "Accepted payment methods")}
              width={card.width}
              height={card.height}
              style={{ width: "auto", height: 28 }}
            />
          </CardWrapper>
        </BottomRight>
      </Bottom>
    </Container>
  );
};

export default Footer;
