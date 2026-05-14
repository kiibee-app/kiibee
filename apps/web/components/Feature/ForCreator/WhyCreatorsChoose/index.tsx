"use client";

import { useTranslation } from "react-i18next";
import { CREATORS } from "@/utils/translationKeys";
import creatorChooseImage from "@/assets/images/creators/creator_choose.webp";
import {
  Section,
  SectionInner,
  BackgroundImage,
  GradientOverlay,
  Content,
  Heading,
  Panel,
  Columns,
  BulletList,
  BulletItem,
} from "./style";

const HEADING_FALLBACK = "Why creators choose Kiibee";
const LEFT_ITEMS_FALLBACK = [
  "Get your own digital content website in just a few clicks",
  "Collect content from multiple platforms (YouTube, Vimeo, Dropbox, etc.) in one place",
  "Sell content or offer it for free",
  "Protect content with access codes or email signups",
  "Use your own payment module (Dankort, credit card, MobilePay)",
  "Offer content as downloads or online streaming",
  "Create online programs and digital courses",
  "Take payment for live streaming events",
];
const RIGHT_ITEMS_FALLBACK = [
  "See statistics on views and sales",
  "Show content on all devices — mobile, tablet and desktop",
  "Sell multiple formats (video, PDF, ePub, MP3, audio)",
  "Store content securely on Danish servers, fully GDPR compliant",
  "Get tailored solutions based on your needs",
  "Sell and show your content anywhere on the web",
  "Create your own channel or site with curated collections",
];

const getItems = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];

export default function WhyCreatorsChoose() {
  const { t } = useTranslation();
  const leftItems = getItems(
    t(CREATORS.whyChoose.leftItems, { returnObjects: true }),
  );
  const rightItems = getItems(
    t(CREATORS.whyChoose.rightItems, { returnObjects: true }),
  );
  const safeLeftItems = leftItems.length > 0 ? leftItems : LEFT_ITEMS_FALLBACK;
  const safeRightItems =
    rightItems.length > 0 ? rightItems : RIGHT_ITEMS_FALLBACK;

  return (
    <Section>
      <SectionInner>
        <BackgroundImage $image={creatorChooseImage.src} aria-hidden="true" />
        <GradientOverlay aria-hidden="true" />

        <Content>
          <Heading>
            {t(CREATORS.whyChoose.heading, {
              defaultValue: HEADING_FALLBACK,
            })}
          </Heading>

          <Panel>
            <Columns>
              <BulletList>
                {safeLeftItems.map((item) => (
                  <BulletItem key={item}>{item}</BulletItem>
                ))}
              </BulletList>

              <BulletList>
                {safeRightItems.map((item) => (
                  <BulletItem key={item}>{item}</BulletItem>
                ))}
              </BulletList>
            </Columns>
          </Panel>
        </Content>
      </SectionInner>
    </Section>
  );
}
