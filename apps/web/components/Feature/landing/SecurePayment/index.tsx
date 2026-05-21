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
} from "./styles";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import ScrollReveal from "@/components/UI/ScrollReveal";

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
          <ScrollReveal delay={0.1}>
            <Description>
              <MonoText $use="Body_Regular" color={COLORS.primary.WHITE}>
                {t("securePayment.description")}
              </MonoText>
            </Description>
          </ScrollReveal>
        </TextColumn>

        <ImageColumn>
          <HeroImageWrap>
            <Image
              src={hero}
              alt={t("securePayment.heroImageAlt")}
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority
            />
          </HeroImageWrap>

          <ImageCard>
            <Image
              src={creator}
              alt={t("securePayment.creatorImageAlt")}
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority
            />
          </ImageCard>
        </ImageColumn>
      </SectionInner>
    </Section>
  );
}
