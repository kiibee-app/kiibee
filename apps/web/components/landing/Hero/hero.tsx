"use client";

import React from "react";
import {
  Hero,
  Inner,
  Content,
  Title,
  Subtitle,
  CTAWrap,
  Primary,
  Secondary,
} from "./styles";
import Image from "next/image";
import { Background } from "./styles";

export default function HeroSection() {
  return (
    <Hero>
      <Background>
        <Image
          src="/images/hero.png"
          alt="Hero background"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </Background>
      <Inner>
        <Content>
          <Title>
            Discover and enjoy unique digital content from your favorite
            creators.
          </Title>
          <Subtitle>
            Watch, listen, and learn directly from independent creators. Rent or
            buy exclusive content in just a few clicks
          </Subtitle>

          <CTAWrap>
            <Primary href="#">Join Kiibee now</Primary>
            <Secondary href="#">Learn more</Secondary>
          </CTAWrap>
        </Content>
      </Inner>
    </Hero>
  );
}
