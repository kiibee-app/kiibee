"use client";

import { useTranslation } from "react-i18next";
import {
  BusinessInsightsIcon,
  CardIcon,
  GuardIcon,
  MarketingIcon,
  StreamingIcon,
  WebIcon,
} from "@/assets/icons";
import { CREATORS } from "@/utils/translationKeys";
import creatorChooseImage from "@/assets/images/creators/creator_choose.webp";
import {
  Section,
  SectionInner,
  BackgroundImage,
  Content,
  Heading,
  FeatureGrid,
  FeatureCard,
  FeatureCardContent,
  IconSlot,
  FeatureTitle,
  FeatureDescription,
} from "./styles";

const HEADING_FALLBACK = "Why creators choose Kiibee";
const FEATURE_ICON_COLOR = "currentColor";

const FEATURES = [
  {
    key: "website",
    title: "Your Website, Your Brand",
    description: "Sell directly from your own website.",
    icon: <WebIcon width={30} height={30} color={FEATURE_ICON_COLOR} />,
  },
  {
    key: "payments",
    title: "Easy Payments",
    description: "Fast, secure checkout with trusted payment methods.",
    icon: <CardIcon width={40} height={40} color={FEATURE_ICON_COLOR} />,
  },
  {
    key: "insights",
    title: "Business Insights",
    description: "Track sales and understand your audience.",
    icon: <BusinessInsightsIcon color={FEATURE_ICON_COLOR} />,
  },
  {
    key: "marketing",
    title: "Marketing & Promotion",
    description: "Reach more customers through Kiibee.",
    icon: <MarketingIcon color={FEATURE_ICON_COLOR} />,
  },
  {
    key: "streaming",
    title: "Streaming & Downloads",
    description: "Deliver content with ease and reliability.",
    icon: <StreamingIcon color={FEATURE_ICON_COLOR} />,
  },
  {
    key: "security",
    title: "Secure & GDPR Compliant",
    description:
      "Store content securely on Danish servers, fully GDPR compliant.",
    icon: <GuardIcon color={FEATURE_ICON_COLOR} />,
  },
] as const;

export default function WhyCreatorsChoose() {
  const { t } = useTranslation();

  return (
    <Section>
      <SectionInner>
        <BackgroundImage $image={creatorChooseImage.src} aria-hidden="true" />

        <Content>
          <Heading>
            {t(CREATORS.whyChoose.heading, {
              defaultValue: HEADING_FALLBACK,
            })}
          </Heading>

          <FeatureGrid>
            {FEATURES.map(({ key, title, description, icon }) => (
              <FeatureCard key={key}>
                <FeatureCardContent>
                  <IconSlot>{icon}</IconSlot>
                  <FeatureTitle>
                    {t(CREATORS.whyChoose.featureTitle(key), {
                      defaultValue: title,
                    })}
                  </FeatureTitle>
                  <FeatureDescription>
                    {t(CREATORS.whyChoose.featureDescription(key), {
                      defaultValue: description,
                    })}
                  </FeatureDescription>
                </FeatureCardContent>
              </FeatureCard>
            ))}
          </FeatureGrid>
        </Content>
      </SectionInner>
    </Section>
  );
}
