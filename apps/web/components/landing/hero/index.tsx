"use client";

import React from "react";
import { Hero, Inner, Content, Title, Subtitle, CTAWrap } from "./styles";
import Image from "next/image";
import { Background } from "./styles";
import hero from "../../../assets/images/hero.png";
import GenericButton from "../../UI/GenericButton";

export default function HeroSection() {
  return (
    <Hero>
      <Background>
        <Image
          src={hero}
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
            <GenericButton asAnchor href="#" variant="primary">
              Join Kiibee now
            </GenericButton>
          </CTAWrap>
        </Content>
      </Inner>
    </Hero>
  );
}
