"use client";

import Image from "next/image";
import Link from "next/link";
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

const Footer = () => {
  const { t } = useTranslation();

  const year = new Date().getFullYear();

  const columns = [
    {
      title: "Information",
      items: [
        { label: "About us", href: null },
        { label: "How it works", href: null },
        { label: "For creators", href: null },
        { label: "Explore creators", href: null },
        { label: "Pricing", href: null },
      ],
    },
    {
      title: "Helpful Links",
      items: [
        { label: "Tutorial videos", href: null },
        { label: "User guides", href: null },
      ],
    },
    {
      title: "Contact Us",
      items: [{ label: "Support", href: null }],
    },
  ];

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

        {columns.map((col) => (
          <Column key={col.title}>
            <Title>{col.title}</Title>

            {col.items.map((item, idx) => (
              <LinkItem key={`${col.title}-${idx}`} href={item.href ?? "#"}>
                {item.label}
              </LinkItem>
            ))}
          </Column>
        ))}
      </Top>

      <Divider />

      <Bottom>
        <BottomLeft>
          © {year} Kiibee ApS - CVR: 34898634 - info@kiibee.dk
        </BottomLeft>

        <BottomRight>
          <LinkRow>
            <span>.Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Cookie Settings</span>
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
