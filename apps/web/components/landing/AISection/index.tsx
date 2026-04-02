"use client";

import GenericButton from "@/components/UI/GenericButton";
import { creators, steps, trendingContent } from "@/utils/aiSectionData";
import {
  Section,
  Content,
  Header,
  Heading,
  Tagline,
  Layout,
  PreviewPanel,
  PanelHeading,
  CardsGrid,
  TrendCard,
  TrendTag,
  TrendTitle,
  TrendMeta,
  TrendAction,
  CreatorsRow,
  CreatorPill,
  CreatorAvatar,
  CreatorDetails,
  CreatorName,
  CreatorSubtext,
  StepsColumn,
  StepCard,
  StepNumber,
  StepLabel,
  StepDescription,
  CTAWrapper,
} from "./styles";

export default function AISection() {
  return (
    <Section>
      <Content>
        <Header>
          <Heading>How it works</Heading>
          <Tagline>Start watching in just a few steps.</Tagline>
        </Header>
        <Layout>
          <PreviewPanel>
            <PanelHeading>Trending content</PanelHeading>
            <CardsGrid>
              {trendingContent.map(({ category, title, creator, action }) => (
                <TrendCard key={title}>
                  <TrendTag>{category}</TrendTag>
                  <TrendTitle>{title}</TrendTitle>
                  <TrendMeta>{creator}</TrendMeta>
                  <TrendAction>{action}</TrendAction>
                </TrendCard>
              ))}
            </CardsGrid>
            <CreatorsRow>
              {creators.map(({ name, detail }) => (
                <CreatorPill key={name}>
                  <CreatorAvatar aria-hidden />
                  <CreatorDetails>
                    <CreatorName>{name}</CreatorName>
                    <CreatorSubtext>{detail}</CreatorSubtext>
                  </CreatorDetails>
                </CreatorPill>
              ))}
            </CreatorsRow>
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
