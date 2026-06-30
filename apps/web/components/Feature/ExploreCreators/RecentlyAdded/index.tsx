"use client";

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import TutorialCard from "@/components/Feature/TutorialVideos/TutorialCard";
import { LeftIcon } from "@/assets/icons";
import {
  HeaderActions,
  Section,
  SectionArrow,
  SectionArrows,
  SectionTag,
} from "./styles";
import {
  SectionHeader,
  SectionLabel,
  SectionLink,
} from "../../TutorialVideos/TutorialContent/styles";
import { MonoText } from "@/components/UI/Monotext";
import { Grid } from "../../TutorialVideos/TutorialsShowcase/styles";
import { useRecentContent } from "@/hooks/feed/useRecentContent";
import {
  FEED_CONTENT_PAGE_SIZE,
  getFeedPageSlice,
  getPaginationState,
} from "@/utils/feedContentToTutorial";
import Skeleton from "@/components/UI/Skeleton";
import { PATHS } from "@/utils/path";
import {
  SkeletonCard,
  SkeletonImage,
  SkeletonTitle,
  SkeletonSubtitle,
  SkeletonBadge,
  SkeletonFooter,
} from "../Creators/styles";
import { SKELETON_COUNT } from "@/utils/Constants";

export default function RecentlyAdded() {
  const { t } = useTranslation();
  const { tutorials, isLoading } = useRecentContent({ limit: 999 });
  const [pageStart, setPageStart] = useState(0);

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
              {t("creators.recentlyAdded.tag")}
            </MonoText>
          </SectionTag>
        </SectionLabel>
        <HeaderActions>
          {canSlide ? (
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
          ) : (
            <SectionLink href={PATHS.TUTORIAL_VIDEOS}>
              <LeftIcon />
            </SectionLink>
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
