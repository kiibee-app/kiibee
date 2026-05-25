"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import {
  creators,
  CREATOR_DESCRIPTIONS,
} from "@/utils/dummyData/creators.data";
import SafeImage from "@/components/UI/SafeImage";
import { MonoText } from "@/components/UI/Monotext";
import { PATHS } from "@/utils/path";
import { CREATORS } from "@/utils/translationKeys";
import {
  Section,
  HeaderSection,
  Title,
  MarqueeContainer,
  MarqueeRow,
  MarqueeTrackLeft,
  MarqueeTrackRight,
  CreatorCard,
  CardLeft,
  CardHeader,
  CardTitle,
  CategoryBadge,
  CardDescription,
  ProfileButton,
  CardRight,
  BottomCta,
  SeeAllButton,
} from "./styles";

export default function ExploreCreatorsMarquee() {
  const { t } = useTranslation();

  const uniqueCreators = creators.slice(0, 4);

  const row1Creators = [
    uniqueCreators[0],
    uniqueCreators[2],
    uniqueCreators[1],
    uniqueCreators[3],
  ];
  const row2Creators = [
    uniqueCreators[3],
    uniqueCreators[1],
    uniqueCreators[2],
    uniqueCreators[0],
  ];

  const duplicatedRow1 = [...row1Creators, ...row1Creators];
  const duplicatedRow2 = [...row2Creators, ...row2Creators];

  const renderCreatorCard = (
    creator: (typeof creators)[0],
    idx: number,
    prefix: string,
  ) => {
    const description =
      CREATOR_DESCRIPTIONS[creator.name] ||
      "Explore exclusive digital content, personal updates, and supportive communities directly from your favorite creator.";

    return (
      <CreatorCard key={`${prefix}-${creator.id}-${idx}`}>
        <CardLeft>
          <CardHeader>
            <CardTitle>
              <MonoText $use="Body_Bold">{creator.name}</MonoText>
            </CardTitle>
            <CategoryBadge>
              <MonoText
                $use="Body_Bold"
                style={{ fontSize: "inherit", color: "inherit" }}
              >
                {creator.category}
              </MonoText>
            </CategoryBadge>
          </CardHeader>
          <CardDescription>
            <MonoText
              $use="Body_Small"
              style={{ fontSize: "inherit", color: "inherit" }}
            >
              {description}
            </MonoText>
          </CardDescription>
          <ProfileButton
            href={`${PATHS.EXPLORE_CREATORS}?creator=${encodeURIComponent(creator.name)}`}
          >
            {t(CREATORS.viewProfile)}
          </ProfileButton>
        </CardLeft>
        <CardRight>
          <SafeImage
            src={creator.image}
            alt={creator.name}
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            sizes="(max-width: 768px) 90px, 120px"
          />
        </CardRight>
      </CreatorCard>
    );
  };

  return (
    <Section>
      <HeaderSection>
        <Title>
          <MonoText $use="Heading2">{t("creators.marquee.title")}</MonoText>
        </Title>
      </HeaderSection>

      <MarqueeContainer>
        <MarqueeRow>
          <MarqueeTrackLeft>
            {duplicatedRow1.map((creator, idx) =>
              renderCreatorCard(creator, idx, "row1"),
            )}
          </MarqueeTrackLeft>
        </MarqueeRow>
        <MarqueeRow>
          <MarqueeTrackRight>
            {duplicatedRow2.map((creator, idx) =>
              renderCreatorCard(creator, idx, "row2"),
            )}
          </MarqueeTrackRight>
        </MarqueeRow>
      </MarqueeContainer>

      <BottomCta>
        <SeeAllButton asAnchor href={PATHS.EXPLORE_CREATORS}>
          <MonoText $use="Body_Medium" style={{ color: "inherit" }}>
            {t(CREATORS.seeAll)}
          </MonoText>
        </SeeAllButton>
      </BottomCta>
    </Section>
  );
}
