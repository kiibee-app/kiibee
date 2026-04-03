"use client";

import Image from "next/image";
import { LeftArrowIcon, RightArrowIcon } from "../../../assets/icons";
import creator from "../../../assets/images/testimonial/creator.jpg";
import {
  ArrowButton,
  ArrowIcon,
  Author,
  Background,
  Card,
  Quote,
  Section,
  SectionInner,
} from "./styles";

export default function TestimonialSection() {
  return (
    <Section>
      <Background>
        <Image
          src={creator}
          alt="Creator testimonial background"
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </Background>

      <ArrowButton aria-label="Previous testimonial" $left>
        <ArrowIcon>
          <LeftArrowIcon />
        </ArrowIcon>
      </ArrowButton>

      <ArrowButton aria-label="Next testimonial">
        <ArrowIcon>
          <RightArrowIcon />
        </ArrowIcon>
      </ArrowButton>

      <SectionInner>
        <Card>
          <Quote>
            &ldquo;As a graphic designer, I&apos;m always looking to expand my
            skills and stay inspired. Kiibe has been a game-changer for me. Its
            content is practical, creative, and easy to follow. I&apos;ve picked
            up new techniques and design tips I wouldn&apos;t have found
            anywhere else. It&apos;s like having a mini design workshop right at
            my fingertips!&rdquo;
          </Quote>

          <Author>Kamma, freelance graphic designer</Author>
        </Card>
      </SectionInner>
    </Section>
  );
}
