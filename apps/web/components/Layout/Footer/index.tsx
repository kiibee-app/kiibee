"use client";

import { useTranslation } from "react-i18next";
import { NAV } from "@/utils/translationKeys";
import {
  Container,
  Top,
  Column,
  Title,
  LogoRow,
  LinkItem,
  Bottom,
  IconRow,
  IconLink,
  BottomLeft,
  BottomRight,
  Divider,
  CardWrapper,
  LinkRow,
  BottomLink,
  PaymentCardImage,
  LinkGroup,
} from "./styles";
import logo from "../../../assets/images/kiibee-logo.svg";
import card from "../../../assets/images/card.webp";
import { FacebookIcon, InstagramIcon } from "@/assets/icons";
import { footerConfig, footerLinks } from "@/utils/footerConfig";
import { MonoText } from "@/components/UI/Monotext";
import SafeImage from "@/components/UI/SafeImage";
import COLORS from "@repo/ui/colors";

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <Container>
      <Top>
        <Column>
          <LogoRow>
            <SafeImage src={logo} alt={t(NAV.logoAlt)} />
          </LogoRow>
          <IconRow>
            <IconLink
              href="https://www.facebook.com/share/18VJ6FJQxw/?mibextid=wwXIfr"
              target="_blank"
              rel="noreferrer noopener"
            >
              <FacebookIcon />
            </IconLink>
            <IconLink
              href="https://www.instagram.com/kiibee_dk?igsh=MXJzMjgxbnJleG00dQ%3D%3D&utm_source=qr"
              target="_blank"
              rel="noreferrer noopener"
            >
              <InstagramIcon />
            </IconLink>
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
            {footerLinks.map((group, groupIndex) => (
              <LinkGroup key={groupIndex}>
                {group.map(({ href, label }) => (
                  <BottomLink
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MonoText $use="Body_Medium" color={COLORS.primary.WHITE}>
                      {t(label)}
                    </MonoText>
                  </BottomLink>
                ))}
              </LinkGroup>
            ))}
          </LinkRow>
          <CardWrapper>
            <PaymentCardImage
              src={card}
              alt={t(NAV.logoAlt)}
              width={card.width}
              height={card.height}
            />
          </CardWrapper>
        </BottomRight>
      </Bottom>
    </Container>
  );
};

export default Footer;
