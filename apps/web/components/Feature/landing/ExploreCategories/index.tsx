"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { MonoText } from "@/components/UI/Monotext";
import { PATHS } from "@/utils/path";
import TutorialCard from "@/components/Feature/TutorialVideos/TutorialCard";
import ScrollReveal from "@/components/UI/ScrollReveal";
import { LANDING_REVEAL } from "@/utils/landingUtils";
import { useRecentContent } from "@/hooks/feed/useRecentContent";
import { CATEGORY_ALL } from "@/utils/Constants";
import { toCamelCaseKey } from "@/utils/common";
import type { TFunction } from "i18next";
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

const getCategoryLabel = (category: string, t: TFunction) => {
  if (category === CATEGORY_ALL) {
    return t("exploreCategories.categories.all");
  }
  const key = toCamelCaseKey(category);

  const paths = [
    `viewerSignup.preference.content.options.${key}`,
    `exploreCategories.categories.${key}`,
    `creators.filters.options.categories.${key}`,
  ];

  for (const path of paths) {
    const translation = t(path);
    if (translation && translation !== path) {
      return translation;
    }
  }
  return category;
};

export default function ExploreCategories() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORY_ALL);
  const { tutorials, isLoading } = useRecentContent();

  const categoriesList = useMemo(() => {
    const uniqueCategories = new Set<string>();
    tutorials.forEach((item) => {
      if (item.category) {
        uniqueCategories.add(item.category);
      }
    });
    return [CATEGORY_ALL, ...Array.from(uniqueCategories)];
  }, [tutorials]);

  const resolvedActiveCategory = useMemo(() => {
    return categoriesList.includes(activeCategory)
      ? activeCategory
      : CATEGORY_ALL;
  }, [categoriesList, activeCategory]);

  const filteredItems = useMemo(() => {
    if (resolvedActiveCategory === CATEGORY_ALL) {
      return tutorials;
    }
    return tutorials.filter((item) => item.category === resolvedActiveCategory);
  }, [tutorials, resolvedActiveCategory]);

  if (isLoading || tutorials.length === 0) {
    return null;
  }

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
        {categoriesList.map((catKey) => {
          const isActive = resolvedActiveCategory === catKey;
          const sanitizedId = catKey.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          return (
            <FilterPill
              key={catKey}
              id={`category-filter-pill-${sanitizedId}`}
              $active={isActive}
              onClick={() => setActiveCategory(catKey)}
            >
              <MonoText $use="Body_Bold">
                {getCategoryLabel(catKey, t)}
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
          href={PATHS.EXPLORE}
        >
          <MonoText $use="Body_Bold">
            {t("exploreCategories.browseAll")}
          </MonoText>
        </BrowseAllButton>
      </BottomCtaSection>
    </Section>
  );
}
