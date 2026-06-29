"use client";

import { useTranslation } from "react-i18next";
import Carousel from "@/components/UI/Carousel";
import { testimonialSlides } from "@/utils/data";
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

  const slides = testimonialSlides.map((slide) => ({
    ...slide,
    quote: t(slide.quoteKey),
    author: t(slide.authorKey),
  }));

  return (
    <Section>
      <Carousel
        items={slides}
        transitionType="fade"
        prevAriaLabel={t("testimonial.prevAriaLabel")}
        nextAriaLabel={t("testimonial.nextAriaLabel")}
        renderItem={(item) => (
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
