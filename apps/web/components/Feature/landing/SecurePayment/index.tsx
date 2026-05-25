"use client";

import Image from "@/components/UI/SafeImage";
import { useTranslation } from "react-i18next";
import hero from "@/assets/images/mobilePay.webp";
import creator from "@/assets/images/laptopMan.webp";
import {
  Description,
  HeroImageWrap,
  ImageColumn,
  ImageCard,
  Section,
  SectionInner,
  TextColumn,
  securePaymentImageStyle,
  securePaymentRevealStyle,
} from "./styles";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import ScrollReveal from "@/components/UI/ScrollReveal";
import ImageReveal from "@/components/UI/ImageReveal";
import { LANDING_REVEAL } from "@/utils/landingUtils";
import { IMAGE_SIZES } from "@/utils/imageSizes";
import {
  LANDING_IMAGE_FLAGS,
  LANDING_REVEAL_VARIANTS,
} from "@/utils/landingUtils";

export default function SecurePaymentSection() {
  const { t } = useTranslation();

  return (
    <Section>
      <SectionInner>
        <TextColumn>
          <ScrollReveal>
            <MonoText $use="Heading1" color={COLORS.primary.WHITE}>
              {t("securePayment.title")}
            </MonoText>
          </ScrollReveal>
          <ScrollReveal delay={LANDING_REVEAL.shortDelay}>
            <Description>
              <MonoText $use="Body_Regular" color={COLORS.primary.WHITE}>
                {t("securePayment.description")}
              </MonoText>
            </Description>
          </ScrollReveal>
        </TextColumn>

        <ImageColumn>
          <HeroImageWrap>
            <ImageReveal
              variant={LANDING_REVEAL_VARIANTS.slideLeft}
              duration={LANDING_REVEAL.longRevealDuration}
              style={securePaymentRevealStyle}
            >
              <Image
                src={hero}
                alt={t("securePayment.heroImageAlt")}
                fill={LANDING_IMAGE_FLAGS.fill}
                sizes={IMAGE_SIZES.securePayment}
                style={securePaymentImageStyle}
                priority={LANDING_IMAGE_FLAGS.priority}
              />
            </ImageReveal>
          </HeroImageWrap>

          <ImageCard>
            <ImageReveal
              variant={LANDING_REVEAL_VARIANTS.slideRight}
              delay={LANDING_REVEAL.mediumDelay}
              duration={LANDING_REVEAL.longRevealDuration}
              style={securePaymentRevealStyle}
            >
              <Image
                src={creator}
                alt={t("securePayment.creatorImageAlt")}
                fill={LANDING_IMAGE_FLAGS.fill}
                sizes={IMAGE_SIZES.securePayment}
                style={securePaymentImageStyle}
                priority={LANDING_IMAGE_FLAGS.priority}
              />
            </ImageReveal>
          </ImageCard>
        </ImageColumn>
      </SectionInner>
    </Section>
  );
}
