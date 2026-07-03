"use client";

import { MonoText } from "@/components/UI/Monotext";
import {
  SectionHeader,
  SectionTag,
  TutorialSection,
} from "../TutorialContent/styles";
import { Grid } from "../TutorialsShowcase/styles";
import QuickguideCard from "../QuickguideCard";
import { useTutorialQuickguides } from "@/hooks/useTutorialQuickguides";
import { useTranslation } from "react-i18next";
import Skeleton from "@/components/UI/Skeleton";
import {
  SkeletonCard,
  SkeletonImage,
  SkeletonTitle,
  SkeletonFooter,
} from "@/components/Feature/ExploreCreators/Creators/styles";

function QuickguidesSkeleton() {
  return (
    <Grid $columnMax="350px" $alignStart>
      {Array.from({ length: 2 }).map((_, index) => (
        <SkeletonCard key={index}>
          <SkeletonImage />
          <SkeletonTitle />
          <SkeletonFooter />
        </SkeletonCard>
      ))}
    </Grid>
  );
}

export default function QuickguidesSection() {
  const { t } = useTranslation();
  const { guides, isLoading, isError } = useTutorialQuickguides();

  if (isError || (!isLoading && guides.length === 0)) {
    return null;
  }

  return (
    <TutorialSection id="quickguides">
      <SectionHeader>
        <SectionTag>
          <MonoText $use="H4_Medium">
            {t("tutorialVideos.quickguidesTitle")}
          </MonoText>
        </SectionTag>
      </SectionHeader>
      {isLoading ? (
        <>
          <Skeleton.Header />
          <QuickguidesSkeleton />
        </>
      ) : (
        <Grid $columnMax="350px" $alignStart>
          {guides.map((guide) => (
            <QuickguideCard key={guide.id} guide={guide} />
          ))}
        </Grid>
      )}
    </TutorialSection>
  );
}
