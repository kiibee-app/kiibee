"use client";

import { useState } from "react";
import TutorialCard from "@/components/Feature/TutorialVideos/TutorialCard";
import { MonoText } from "@/components/UI/Monotext";
import { useTrendingContent } from "@/hooks/feed/useTrendingContent";
import { LOAD_MORE_SIZE, SKELETON_COUNT } from "@/utils/Constants";
import { Section, SectionTag } from "../RecentlyAdded/styles";
import Skeleton from "@/components/UI/Skeleton";
import { FEED_CONTENT_PAGE_SIZE } from "@/utils/feedContentToTutorial";
import {
  SectionHeader,
  SectionLabel,
} from "../../TutorialVideos/TutorialContent/styles";
import { Grid } from "../../TutorialVideos/TutorialsShowcase/styles";
import { useTranslation } from "react-i18next";
import { LoadMoreContainer, LoadMoreButton } from "./styles";
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
  const [limit, setLimit] = useState(LOAD_MORE_SIZE);
  const { tutorials, isLoading } = useTrendingContent(limit);
  const hasMore = tutorials.length >= limit;

  const handleLoadMore = () => {
    setLimit((prev) => prev + LOAD_MORE_SIZE);
  };

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
          : tutorials.map((tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
      </Grid>
      {hasMore && !isLoading && (
        <LoadMoreContainer>
          <LoadMoreButton
            variant="primary"
            type="button"
            onClick={handleLoadMore}
          >
            {t("creators.loadMore")}
          </LoadMoreButton>
        </LoadMoreContainer>
      )}
    </Section>
  );
}
