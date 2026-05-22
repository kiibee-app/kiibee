"use client";

import GenericButton from "@/components/UI/GenericButton";
import { trendingContentSteps } from "@/utils/steps";
import {
  Section,
  Content,
  Header,
  Heading,
  Tagline,
  Layout,
  PreviewPanel,
  StepsColumn,
  StepCard,
  StepDescription,
  CTAWrapper,
  NumberPart,
  watchingStepsPreviewImageStyle,
} from "./styles";
import Image from "@/components/UI/SafeImage";
import { useTranslation } from "react-i18next";
import Steps from "@/assets/images/steps.webp";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { VARIANT } from "@/utils/Constants";
import { PATHS } from "@/utils/path";
import ScrollReveal from "@/components/UI/ScrollReveal";
import ImageReveal from "@/components/UI/ImageReveal";
import { LANDING_REVEAL } from "@/utils/landingReveal";
import {
  LANDING_IMAGE_DIMENSIONS,
  LANDING_IMAGE_FLAGS,
  LANDING_REVEAL_VARIANTS,
} from "@/utils/landingConfig";

export default function WatchingSteps() {
  const { t } = useTranslation();
  return (
    <Section>
      <Content>
        <Header>
          <ScrollReveal>
            <Heading>
              <MonoText $use="Heading1" color={COLORS.primary.WHITE}>
                {t("watchingSteps.heading")}
              </MonoText>
            </Heading>
          </ScrollReveal>
          <ScrollReveal delay={LANDING_REVEAL.shortDelay}>
            <Tagline>
              <MonoText $use="H4_Medium" color={COLORS.primary.WHITE}>
                {t("watchingSteps.tagline")}
              </MonoText>
            </Tagline>
          </ScrollReveal>
        </Header>
        <Layout>
          <PreviewPanel>
            <ImageReveal
              variant={LANDING_REVEAL_VARIANTS.slideUp}
              duration={LANDING_REVEAL.longRevealDuration}
            >
              <Image
                src={Steps}
                alt={t("watchingSteps.previewAlt")}
                width={LANDING_IMAGE_DIMENSIONS.watchingSteps.width}
                height={LANDING_IMAGE_DIMENSIONS.watchingSteps.height}
                loading={LANDING_IMAGE_FLAGS.eagerLoading}
                style={watchingStepsPreviewImageStyle}
              />
            </ImageReveal>
          </PreviewPanel>
          <StepsColumn>
            {trendingContentSteps.map((step) => (
              <StepCard key={step.number}>
                <NumberPart>
                  <MonoText $use="H5_Medium" color={COLORS.primary.PALE_GREEN}>
                    {step.number}
                  </MonoText>
                  <MonoText $use="H4_SemiBold" color={COLORS.primary.WHITE}>
                    {t(`watchingSteps.steps.${step.translationKey}.label`)}
                  </MonoText>
                </NumberPart>
                <div>
                  <StepDescription>
                    <MonoText $use="Body_Regular" color={COLORS.primary.WHITE}>
                      {t(
                        `watchingSteps.steps.${step.translationKey}.description`,
                      )}
                    </MonoText>
                  </StepDescription>
                </div>
              </StepCard>
            ))}
            <CTAWrapper>
              <GenericButton
                asAnchor
                href={PATHS.HOW_IT_WORKS}
                variant={VARIANT.PRIMARY}
              >
                {t("watchingSteps.cta")}
              </GenericButton>
            </CTAWrapper>
          </StepsColumn>
        </Layout>
      </Content>
    </Section>
  );
}
