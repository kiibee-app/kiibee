"use client";

import { useTranslation } from "react-i18next";
import Carousel from "@/components/UI/Carousel";
import creator from "@/assets/images/testimonial/creator.webp";
import valueBg from "@/assets/images/cta-buttom.webp";
import ctaImage from "@/assets/images/cta-buttom1.webp";
import {
  Author,
  Background,
  Card,
  Quote,
  Section,
  SectionInner,
  SlideWrapper,
} from "./styles";

export default function TestimonialSection() {
  const { t } = useTranslation();

  const slides = [
    {
      id: 1,
      image: creator,
      bgPosition: "32% 22%",
      bgPositionMobile: "center 20%",
      quote: t("testimonial.quote"),
      author: t("testimonial.author"),
    },
    {
      id: 2,
      image: valueBg,
      bgPosition: "center",
      bgPositionMobile: "center",
      quote: t("testimonial.quote2"),
      author: t("testimonial.author2"),
    },
    {
      id: 3,
      image: ctaImage,
      bgPosition: "center",
      bgPositionMobile: "center",
      quote: t("testimonial.quote3"),
      author: t("testimonial.author3"),
    },
  ];

  return (
    <Section>
      <Carousel
        items={slides}
        transitionType="fade"
        prevAriaLabel={t("testimonial.prevAriaLabel")}
        nextAriaLabel={t("testimonial.nextAriaLabel")}
        renderItem={(item, index, isActive) => (
          <SlideWrapper>
            <Background
              $src={item.image.src}
              $bgPosition={item.bgPosition}
              $bgPositionMobile={item.bgPositionMobile}
              role="img"
              aria-label={t("testimonial.backgroundAlt")}
            />

            <SectionInner>
              <Card>
                <Quote>{item.quote}</Quote>
                <Author>{item.author}</Author>
              </Card>
            </SectionInner>
          </SlideWrapper>
        )}
      />
    </Section>
  );
}
