"use client";

import { useTranslation } from "react-i18next";
import { CREATORS } from "@/utils/translationKeys";
import creatorsWorkingImage from "@/assets/images/we-help-you/marketing-tall.webp";
import instructorImage from "@/assets/images/we-help-you/marketing-top.webp";
import writingImage from "@/assets/images/we-help-you/marketing-bottom.webp";
import {
  Section,
  Container,
  TextColumn,
  Title,
  Description,
  ListIntro,
  BulletList,
  BulletItem,
  Summary,
  CtaButton,
  ImagesColumn,
  LeftImageWrap,
  RightImagesWrap,
  ImageCard,
  TallImage,
  CardImage,
  OverlayTall,
  OverlayCard,
  StatText,
  SupportText,
} from "./styles";
import { PATHS } from "@/utils/path";
import ScrollReveal from "@/components/UI/ScrollReveal";
import ImageReveal from "@/components/UI/ImageReveal";
import { LANDING_REVEAL, LANDING_REVEAL_VARIANTS } from "@/utils/landingUtils";

const IMAGE_REVEAL_STYLE = {
  height: "100%",
} as const;

export default function MarketingSection() {
  const { t } = useTranslation();

  return (
    <Section>
      <Container>
        <TextColumn>
          <ScrollReveal>
            <Title>{t(CREATORS.marketing.title)}</Title>
          </ScrollReveal>
          <ScrollReveal delay={LANDING_REVEAL.shortDelay}>
            <Description>{t(CREATORS.marketing.description)}</Description>
          </ScrollReveal>

          <ScrollReveal delay={LANDING_REVEAL.mediumDelay}>
            <ListIntro>{t(CREATORS.marketing.listIntro)}</ListIntro>
          </ScrollReveal>
          <BulletList>
            {(
              t("creators.marketing.list", {
                returnObjects: true,
              }) as string[]
            ).map((item, index) => (
              <BulletItem key={item}>
                <ScrollReveal
                  sequence={false}
                  delay={
                    LANDING_REVEAL.mediumDelay +
                    LANDING_REVEAL.ctaCardStaggerDelay +
                    index * LANDING_REVEAL.ctaCardStaggerDelay
                  }
                >
                  {item}
                </ScrollReveal>
              </BulletItem>
            ))}
          </BulletList>

          <ScrollReveal delay={LANDING_REVEAL.shortDelay * 4}>
            <Summary>{t("creators.marketing.summary")}</Summary>
          </ScrollReveal>
          <ScrollReveal delay={LANDING_REVEAL.shortDelay * 5}>
            <CtaButton asAnchor href={PATHS.AUTH_SIGNUP}>
              {t("creators.marketing.cta")}
            </CtaButton>
          </ScrollReveal>
        </TextColumn>

        <ImagesColumn>
          <LeftImageWrap>
            <ImageReveal
              id="marketing-left-image"
              variant={LANDING_REVEAL_VARIANTS.slideUp}
              duration={LANDING_REVEAL.longRevealDuration}
              style={IMAGE_REVEAL_STYLE}
            >
              <ImageCard>
                <TallImage
                  src={creatorsWorkingImage}
                  alt={t("creators.marketing.images.creatorsAlt")}
                  fill
                />
                <OverlayTall>
                  <ScrollReveal
                    sequence={false}
                    delay={LANDING_REVEAL.mediumDelay}
                  >
                    <StatText>
                      {t("creators.marketing.stats.products.value")}
                    </StatText>
                  </ScrollReveal>
                  <ScrollReveal
                    sequence={false}
                    delay={
                      LANDING_REVEAL.mediumDelay + LANDING_REVEAL.shortDelay
                    }
                  >
                    <SupportText>
                      {t("creators.marketing.stats.products.label")}
                    </SupportText>
                  </ScrollReveal>
                </OverlayTall>
              </ImageCard>
            </ImageReveal>
          </LeftImageWrap>

          <RightImagesWrap>
            <ImageReveal
              id="marketing-right-image-1"
              variant={LANDING_REVEAL_VARIANTS.fadeScale}
              duration={LANDING_REVEAL.revealDuration}
              delay={LANDING_REVEAL.shortDelay}
              style={IMAGE_REVEAL_STYLE}
            >
              <ImageCard>
                <CardImage
                  src={instructorImage}
                  alt={t("creators.marketing.images.downloadsAlt")}
                  fill
                />
                <OverlayCard>
                  <ScrollReveal
                    sequence={false}
                    delay={LANDING_REVEAL.mediumDelay}
                  >
                    <SupportText>
                      {t("creators.marketing.stats.downloads.label")}
                    </SupportText>
                  </ScrollReveal>
                  <ScrollReveal
                    sequence={false}
                    delay={
                      LANDING_REVEAL.mediumDelay + LANDING_REVEAL.shortDelay
                    }
                  >
                    <StatText>
                      {t("creators.marketing.stats.downloads.value")}
                    </StatText>
                  </ScrollReveal>
                </OverlayCard>
              </ImageCard>
            </ImageReveal>

            <ImageReveal
              id="marketing-right-image-2"
              variant={LANDING_REVEAL_VARIANTS.fadeScale}
              duration={LANDING_REVEAL.revealDuration}
              delay={LANDING_REVEAL.mediumDelay}
              style={IMAGE_REVEAL_STYLE}
            >
              <ImageCard>
                <CardImage
                  src={writingImage}
                  alt={t("creators.marketing.images.setupAlt")}
                  fill
                />
                <OverlayCard>
                  <ScrollReveal
                    sequence={false}
                    delay={LANDING_REVEAL.mediumDelay}
                  >
                    <SupportText>
                      {t("creators.marketing.stats.setup.label")}
                    </SupportText>
                  </ScrollReveal>
                  <ScrollReveal
                    sequence={false}
                    delay={
                      LANDING_REVEAL.mediumDelay + LANDING_REVEAL.shortDelay
                    }
                  >
                    <StatText>
                      {t("creators.marketing.stats.setup.value")}
                    </StatText>
                  </ScrollReveal>
                </OverlayCard>
              </ImageCard>
            </ImageReveal>
          </RightImagesWrap>
        </ImagesColumn>
      </Container>
    </Section>
  );
}
