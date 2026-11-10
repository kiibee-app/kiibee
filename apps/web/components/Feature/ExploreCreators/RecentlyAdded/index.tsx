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
import { RECENT_CONTENT_LIMIT } from "@/utils/Constants";

export default function RecentlyAdded({ search }: { search?: string }) {
  return <RecentlyAddedResults key={search ?? ""} search={search} />;
}

function RecentlyAddedResults({ search }: { search?: string }) {
  const { t } = useTranslation();
  const [limit, setLimit] = useState(RECENT_CONTENT_LIMIT);
  const { tutorials, isLoading, isFetching } = useRecentContent({
    limit,
    search,
  });
  const [pageStart, setPageStart] = useState(0);

  const totalItems = tutorials.length;
  const visibleStart = Math.min(
    pageStart,
    Math.max(totalItems - FEED_CONTENT_PAGE_SIZE, 0),
  );
  const hasMore = totalItems >= limit && limit < 100;
  const { canSlide, canGoPrev, canGoNext } = getPaginationState(
    totalItems,
    visibleStart,
  );

  const movePrev = useCallback(() => {
    setPageStart((prev) => Math.max(prev - FEED_CONTENT_PAGE_SIZE, 0));
  }, []);

  const moveNext = useCallback(() => {
    if (isFetching) return;
    if (canGoNext) {
      setPageStart(
        Math.min(
          visibleStart + FEED_CONTENT_PAGE_SIZE,
          totalItems - FEED_CONTENT_PAGE_SIZE,
        ),
      );
    } else if (hasMore) {
      setLimit((previous) => Math.min(previous + RECENT_CONTENT_LIMIT, 100));
      setPageStart(visibleStart + FEED_CONTENT_PAGE_SIZE);
    }
  }, [canGoNext, hasMore, isFetching, totalItems, visibleStart]);

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
        <Grid $columns={4}>
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

  const visibleTutorials = getFeedPageSlice(tutorials, visibleStart);

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
              {canGoPrev && (
                <SectionArrow
                  type="button"
                  onClick={movePrev}
                  aria-label="Previous"
                >
                  <LeftIcon style={{ transform: "rotate(180deg)" }} />
                </SectionArrow>
              )}
              {(canGoNext || hasMore) && (
                <SectionArrow
                  type="button"
                  onClick={moveNext}
                  aria-label="Next"
                  disabled={isFetching}
                >
                  <LeftIcon />
                </SectionArrow>
              )}
            </SectionArrows>
          ) : (
            <SectionLink href={PATHS.TUTORIAL_VIDEOS}>
              <LeftIcon />
            </SectionLink>
          )}
        </HeaderActions>
      </SectionHeader>
      <Grid $columns={4}>
        {visibleTutorials.map((tutorial) => (
          <TutorialCard
            key={tutorial.id}
            tutorial={tutorial}
            imagePriority={false}
          />
        ))}
      </Grid>
    </Section>
  );
}
