"use client";

import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { PATHS } from "@/utils/path";
import TutorialCard from "@/components/Feature/TutorialVideos/TutorialCard";
import {
  exploreCreatorsData,
  filterMapping,
  MainCategory,
} from "@/utils/exploreCreatorsData";
import {
  Section,
  HeaderSection,
  Title,
  Subtitle,
  FilterBar,
  FilterPill,
  GridContainer,
  BottomCtaSection,
  BrowseAllButton,
} from "./styles";

const CATEGORIES: MainCategory[] = [
  "all",
  "technology",
  "design",
  "art",
  "literature",
  "comedies",
];

export default function ExploreCreatorsMarquee() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<MainCategory>("all");

  const filteredItems = useMemo(() => {
    const allowedIds = filterMapping[activeCategory] || [];
    return exploreCreatorsData.filter((item) => allowedIds.includes(item.id));
  }, [activeCategory]);

  return (
    <Section id="landing-top-categories">
      <HeaderSection>
        <Title>
          <MonoText $use="Heading2">
            {t("exploreCreatorsMarquee.title")}
          </MonoText>
        </Title>
        <Subtitle>
          <MonoText $use="H4_Medium">
            {t("exploreCreatorsMarquee.subtitle")}
          </MonoText>
        </Subtitle>
      </HeaderSection>

      <FilterBar>
        {CATEGORIES.map((catKey) => {
          const isActive = activeCategory === catKey;
          return (
            <FilterPill
              key={catKey}
              id={`category-filter-pill-${catKey}`}
              $active={isActive}
              onClick={() => setActiveCategory(catKey)}
            >
              <MonoText
                $use="Body_Bold"
                color={
                  isActive ? COLORS.neutral.WHITE : COLORS.primary.BLACK_90
                }
              >
                {t(`exploreCreatorsMarquee.categories.${catKey}`)}
              </MonoText>
            </FilterPill>
          );
        })}
      </FilterBar>

      <GridContainer>
        {filteredItems.map((tutorial) => (
          <TutorialCard key={tutorial.id} tutorial={tutorial} />
        ))}
      </GridContainer>

      <BottomCtaSection>
        <BrowseAllButton
          id="browse-all-creators-btn"
          asAnchor
          href={PATHS.EXPLORE_CREATORS}
        >
          <MonoText $use="Body_Bold" color={COLORS.neutral.WHITE}>
            {t("exploreCreatorsMarquee.browseAll")}
          </MonoText>
        </BrowseAllButton>
      </BottomCtaSection>
    </Section>
  );
}
