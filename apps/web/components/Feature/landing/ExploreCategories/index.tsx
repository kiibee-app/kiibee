"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { MonoText } from "@/components/UI/Monotext";
import { PATHS } from "@/utils/path";
import TutorialCard from "@/components/Feature/TutorialVideos/TutorialCard";
import ScrollReveal from "@/components/UI/ScrollReveal";
import { LANDING_REVEAL } from "@/utils/landingUtils";
import {
  exploreCreatorsData,
  filterMapping,
  MainCategory,
  EXPLORE_CATEGORIES,
} from "@/utils/data";
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

export default function ExploreCategories() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<MainCategory>("all");

  const filteredItems = useMemo(() => {
    const allowedIds = filterMapping[activeCategory] || [];
    return exploreCreatorsData.filter((item) => allowedIds.includes(item.id));
  }, [activeCategory]);

  return (
    <Section id="landing-top-categories">
      <HeaderSection>
        <ScrollReveal>
          <Title>
            <MonoText $use="Heading2">{t("exploreCategories.title")}</MonoText>
          </Title>
        </ScrollReveal>
        <ScrollReveal delay={LANDING_REVEAL.shortDelay}>
          <Subtitle>
            <MonoText $use="H4_Medium">
              {t("exploreCategories.subtitle")}
            </MonoText>
          </Subtitle>
        </ScrollReveal>
      </HeaderSection>

      <FilterBar>
        {EXPLORE_CATEGORIES.map((catKey) => {
          const isActive = activeCategory === catKey;
          return (
            <FilterPill
              key={catKey}
              id={`category-filter-pill-${catKey}`}
              $active={isActive}
              onClick={() => setActiveCategory(catKey)}
            >
              <MonoText $use="Body_Bold">
                {t(`exploreCategories.categories.${catKey}`)}
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
          <MonoText $use="Body_Bold">
            {t("exploreCategories.browseAll")}
          </MonoText>
        </BrowseAllButton>
      </BottomCtaSection>
    </Section>
  );
}
