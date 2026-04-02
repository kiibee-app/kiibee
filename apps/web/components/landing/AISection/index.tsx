"use client";

import GenericButton from "@/components/UI/GenericButton";
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

const trendingContent = [
  {
    category: "Design",
    title: "Adobe Lightroom guide",
    creator: "Vera Hells",
    action: "Free",
  },
  {
    category: "Design",
    title: "Knitting pattern",
    creator: "Helle Hansen",
    action: "Rent 2x",
  },
  {
    category: "Educational",
    title: "Sculpture Mastery",
    creator: "Vera Kloss",
    action: "Buy 4x",
  },
  {
    category: "Design",
    title: "Greatest Book Cover",
    creator: "Catharina Klass",
    action: "New Drop",
  },
];

const creators = [
  { name: "Chefi", detail: "24K Subscribers" },
  { name: "Morten Binde", detail: "39K Subscribers" },
  { name: "Kammas Kantine", detail: "10K Subscribers" },
  { name: "Simon Talbot", detail: "46K Subscribers" },
  { name: "Jacob Tarnhoff", detail: "68K Subscribers" },
];

const steps = [
  {
    number: "01",
    label: "Browse",
    description: "Discover creators and collections that match your interests.",
  },
  {
    number: "02",
    label: "Choose",
    description: "Rent, buy, or access the content directly on Kiibee.",
  },
  {
    number: "03",
    label: "Enjoy",
    description: "Stream or download instantly, anytime, anywhere.",
  },
];

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
