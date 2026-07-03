"use client";

import { useCallback, useState } from "react";
import TutorialCard from "@/components/Feature/TutorialVideos/TutorialCard";
import { MonoText } from "@/components/UI/Monotext";
import { useTrendingContent } from "@/hooks/feed/useTrendingContent";
import { SKELETON_COUNT } from "@/utils/Constants";
import {
  Section,
  SectionTag,
  HeaderActions,
  SectionArrows,
  SectionArrow,
} from "../RecentlyAdded/styles";
import Skeleton from "@/components/UI/Skeleton";
import {
  FEED_CONTENT_PAGE_SIZE,
  getFeedPageSlice,
  getPaginationState,
} from "@/utils/feedContentToTutorial";
import {
  SectionHeader,
  SectionLabel,
} from "../../TutorialVideos/TutorialContent/styles";
import { Grid } from "../../TutorialVideos/TutorialsShowcase/styles";
import { useTranslation } from "react-i18next";

import { LeftIcon } from "@/assets/icons";
import {
  SkeletonCard,
  SkeletonImage,
  SkeletonTitle,
  SkeletonSubtitle,
  SkeletonBadge,
  SkeletonFooter,
} from "../Creators/styles";

export default function TrendingContent() {
  const { t } = useTranslation();
  const [pageStart, setPageStart] = useState(0);
  const { tutorials, isLoading } = useTrendingContent();

  const totalItems = tutorials.length;
  const { canSlide, canGoPrev, canGoNext } = getPaginationState(
    totalItems,
    pageStart,
  );

  const movePrev = useCallback(() => {
    setPageStart((prev) => Math.max(prev - FEED_CONTENT_PAGE_SIZE, 0));
  }, []);

  const moveNext = useCallback(() => {
    if (!canSlide) return;
    setPageStart((prev) =>
      Math.min(
        prev + FEED_CONTENT_PAGE_SIZE,
        totalItems - FEED_CONTENT_PAGE_SIZE,
      ),
    );
  }, [canSlide, totalItems]);

  if (isLoading) {
    return (
      <Section>
        <SectionHeader>
          <SectionLabel>
            <SectionTag>
              <Skeleton.Tag />
            </SectionTag>
          </SectionLabel>
        </SectionHeader>
        <Grid $columnMax="300px">
          {Array.from({ length: FEED_CONTENT_PAGE_SIZE }).map((_, i) => (
            <Skeleton.Card key={i} />
          ))}
        </Grid>
      </Section>
    );
  }

  if (tutorials.length === 0) {
    return null;
  }

  const visibleTutorials = getFeedPageSlice(tutorials, pageStart);

  return (
    <Section>
      <SectionHeader>
        <SectionLabel>
          <SectionTag>
            <MonoText $use="H4_Medium">
              {t("creators.trendingContent")}
            </MonoText>
          </SectionTag>
        </SectionLabel>
        <HeaderActions>
          {canSlide && (
            <SectionArrows>
              {canGoPrev ? (
                <SectionArrow
                  type="button"
                  onClick={movePrev}
                  aria-label="Previous"
                >
                  <LeftIcon style={{ transform: "rotate(180deg)" }} />
                </SectionArrow>
              ) : null}
              <SectionArrow
                type="button"
                disabled={!canGoNext}
                aria-disabled={!canGoNext}
                onClick={moveNext}
                aria-label="Next"
              >
                <LeftIcon />
              </SectionArrow>
            </SectionArrows>
          )}
        </HeaderActions>
      </SectionHeader>
      <Grid $columnMax="300px">
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <SkeletonCard key={i}>
                <SkeletonImage />
                <SkeletonBadge />
                <SkeletonTitle />
                <SkeletonSubtitle />
                <SkeletonFooter />
              </SkeletonCard>
            ))
          : visibleTutorials.map((tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
      </Grid>
    </Section>
  );
}
