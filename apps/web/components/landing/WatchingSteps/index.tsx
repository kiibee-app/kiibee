"use client";

import GenericButton from "@/components/UI/GenericButton";
import { steps } from "@/utils/watchSteps";
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
  StepNumber,
  StepLabel,
  StepDescription,
  CTAWrapper,
} from "./styles";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import Steps from "../../../assets/images/steps.png";

export default function WatchingSteps() {
  const { t } = useTranslation();
  return (
    <Section>
      <Content>
        <Header>
          <Heading>{t("watchingSteps.heading")}</Heading>
          <Tagline>{t("watchingSteps.tagline")}</Tagline>
        </Header>
        <Layout>
          <PreviewPanel>
            <Image
              src={Steps}
              alt={t("watchingSteps.previewAlt")}
              width={640}
              height={479}
              style={{
                width: "640px",
                height: "479px",
                aspectRatio: "159 / 119",
                borderRadius: 8,
              }}
            />
          </PreviewPanel>
          <StepsColumn>
            {steps.map((step) => (
              <StepCard key={step.number}>
                <StepNumber>{step.number}</StepNumber>
                <div>
                  <StepLabel>
                    {t(`watchingSteps.steps.${step.translationKey}.label`)}
                  </StepLabel>
                  <StepDescription>
                    {t(
                      `watchingSteps.steps.${step.translationKey}.description`,
                    )}
                  </StepDescription>
                </div>
              </StepCard>
            ))}
            <CTAWrapper>
              <GenericButton asAnchor href="#" variant="primary">
                Learn more
              </GenericButton>
            </CTAWrapper>
          </StepsColumn>
        </Layout>
      </Content>
    </Section>
  );
}
