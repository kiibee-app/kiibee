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
} from "@/utils/feedContentToTutorial";
import { PATHS } from "@/utils/path";

export default function RecentlyAdded() {
  const { t } = useTranslation();
  const { tutorials, isLoading } = useRecentContent();
  const [pageStart, setPageStart] = useState(0);

  const totalItems = tutorials.length;
  const canSlide = totalItems > FEED_CONTENT_PAGE_SIZE;
  const canGoPrev = pageStart > 0;
  const canGoNext = pageStart + FEED_CONTENT_PAGE_SIZE < totalItems;

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

  if (!isLoading && tutorials.length === 0) {
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
        {visibleTutorials.map((tutorial) => (
          <TutorialCard key={tutorial.id} tutorial={tutorial} />
        ))}
      </Grid>
    </Section>
  );
}
