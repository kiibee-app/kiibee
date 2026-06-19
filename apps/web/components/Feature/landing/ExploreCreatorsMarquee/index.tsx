"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import {
  useExploreCreators,
  getCreatorCardImage,
} from "@/hooks/creators/useExploreCreators";
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
import { getPublicCreatorProfilePath } from "@/utils/creatorChannel";
import { MARQUEE_LIMIT } from "@/utils/Constants";

export default function ExploreCreatorsMarquee() {
  const { t } = useTranslation();
  const { creators: allCreators } = useExploreCreators();
  const creators = allCreators
    .filter((c) => Boolean(c.profileImageUrl))
    .slice(0, MARQUEE_LIMIT);
  const displayCreators = [...creators, ...creators];

  const renderCreatorCard = (
    creator: (typeof creators)[0],
    idx: number,
    prefix: string,
  ) => {
    const imageUrl = getCreatorCardImage(creator) ?? undefined;
    const description =
      creator.contentDescription ?? t(CREATORS.marquee.defaultDescription);

    return (
      <CreatorCard key={`${prefix}-${creator.id}-${idx}`}>
        <CardLeft>
          <CardHeader>
            <CardTitle>
              <MonoText $use="Body_Bold">{creator.name}</MonoText>
            </CardTitle>
            {creator.category && (
              <CategoryBadge>
                <MonoText
                  $use="Body_Bold"
                  style={{ fontSize: "inherit", color: "inherit" }}
                >
                  {creator.category}
                </MonoText>
              </CategoryBadge>
            )}
          </CardHeader>
          {description && (
            <CardDescription>
              <MonoText
                $use="Body_Small"
                style={{ fontSize: "inherit", color: "inherit" }}
              >
                {description}
              </MonoText>
            </CardDescription>
          )}
          <ProfileButton
            href={getPublicCreatorProfilePath(creator.id, creator.layout)}
          >
            {t(CREATORS.viewProfile)}
          </ProfileButton>
        </CardLeft>
        <CardRight>
          {imageUrl ? (
            <SafeImage
              src={imageUrl}
              alt={creator.name}
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              sizes="(max-width: 768px) 90px, 120px"
            />
          ) : null}
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
        {[MarqueeTrackLeft, MarqueeTrackRight].map((Track, i) => (
          <MarqueeRow key={i}>
            <Track>
              {displayCreators.map((creator, idx) =>
                renderCreatorCard(creator, idx, `row${i}`),
              )}
            </Track>
          </MarqueeRow>
        ))}
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
