"use client";

import GenericButton from "@/components/UI/GenericButton";
import { steps } from "@/utils/aiSectionData";
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

export default function WatchingSteps() {
  return (
    <Section>
      <Content>
        <Header>
          <Heading>How it works</Heading>
          <Tagline>Start watching in just a few steps.</Tagline>
        </Header>
        <Layout>
          <PreviewPanel>
            <Image
              src="/images/steps.png"
              alt="How it works"
              width={640}
              height={479}
              style={{
                width: "640px",
                height: "479px",
                aspectRatio: "159 / 119 , border-radius: 8px",
              }}
            />
          </PreviewPanel>
          <StepsColumn>
            {steps.map((step) => (
              <StepCard key={step.number}>
                <StepNumber>{step.number}</StepNumber>
                <div>
                  <StepLabel>{step.label}</StepLabel>
                  <StepDescription>{step.description}</StepDescription>
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
