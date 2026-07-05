"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { LeftIcon } from "@/assets/icons";
import {
  Content,
  HeroBlock,
  HeroSubtitle,
  SectionHeader,
  SectionLabel,
  SectionTag,
  TutorialSection,
} from "./styles";
import TutorialCard from "../TutorialCard";
import { useTranslation } from "react-i18next";
import { MonoText } from "@/components/UI/Monotext";
import { useRouter } from "next/navigation";
import { SCROLL_TO_START_OPTIONS } from "@/utils/Constants";
import { useTutorialVideos } from "@/hooks/useTutorialVideos";
import Skeleton from "@/components/UI/Skeleton";
import GenericCard from "@/components/UI/GenericCard";
import COLORS from "@repo/ui/colors";
import ContentPreviewModal from "@/components/Feature/SingleContentPage/ContentPreviewModal";
import { FORMAT_TYPE, type TutorialVideo } from "@/utils/types";
import { Grid } from "../TutorialsShowcase/styles";
import {
  SkeletonCard,
  SkeletonImage,
  SkeletonTitle,
  SkeletonSubtitle,
  SkeletonBadge,
  SkeletonFooter,
} from "@/components/Feature/ExploreCreators/Creators/styles";
import {
  HeaderActions,
  SectionArrows,
  SectionArrow,
} from "@/components/Feature/ExploreCreators/RecentlyAdded/styles";
import {
  getFeedPageSlice,
  getPaginationState,
  TUTORIAL_VIDEOS_PAGE_SIZE,
} from "@/utils/feedContentToTutorial";
import {
  getQuickguideItems,
  getVideoItems,
  QUICKGUIDES_SECTION_ID,
  tutorialVideoApiToCard,
  type TutorialQuickguideApiItem,
  type TutorialVideoSectionApiItem,
} from "@/utils/tutorialVideoMapper";

function scrollToSectionHash() {
  const id = window.location.hash.slice(1);
  if (!id) return;
  document.getElementById(id)?.scrollIntoView(SCROLL_TO_START_OPTIONS);
}

function TutorialSectionSkeleton({ columns = TUTORIAL_VIDEOS_PAGE_SIZE }) {
  return (
    <Grid $columns={columns}>
      {Array.from({ length: columns }).map((_, index) => (
        <SkeletonCard key={index}>
          <SkeletonImage />
          <SkeletonBadge />
          <SkeletonTitle />
          <SkeletonSubtitle />
          <SkeletonFooter />
        </SkeletonCard>
      ))}
    </Grid>
  );
}

function QuickguideItemCard({
  guide,
  freeLabel,
}: {
  guide: TutorialQuickguideApiItem;
  freeLabel: string;
}) {
  const [showPdf, setShowPdf] = useState(false);

  return (
    <>
      <GenericCard
        coverImage
        image={guide.thumbnailUrl ?? undefined}
        imageInitials={guide.thumbnailUrl ? undefined : "PDF"}
        alt={guide.title}
        title={<MonoText $use="Body_Medium">{guide.title}</MonoText>}
        subtitle={
          <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY_400}>
            {freeLabel}
          </MonoText>
        }
        onClick={() => setShowPdf(true)}
      />

      <ContentPreviewModal
        visible={showPdf}
        onClose={() => setShowPdf(false)}
        src={guide.pdfUrl}
        type={FORMAT_TYPE.PDF}
        title={guide.title}
      />
    </>
  );
}

function TutorialSectionRow({
  section,
  freeLabel,
}: {
  section: TutorialVideoSectionApiItem;
  freeLabel: string;
}) {
  const router = useRouter();
  const isQuickguides = section.id === QUICKGUIDES_SECTION_ID;
  const videoItems = getVideoItems(section);
  const quickguideItems = getQuickguideItems(section);
  const tutorials = useMemo(
    (): TutorialVideo[] =>
      videoItems.map((video) =>
        tutorialVideoApiToCard(video, section.title, freeLabel),
      ),
    [videoItems, section.title, freeLabel],
  );
  const [pageStart, setPageStart] = useState(0);
  const totalItems = tutorials.length;
  const maxPageStart = Math.max(0, totalItems - TUTORIAL_VIDEOS_PAGE_SIZE);
  const effectivePageStart = Math.min(pageStart, maxPageStart);
  const { canSlide, canGoPrev, canGoNext } = getPaginationState(
    totalItems,
    effectivePageStart,
    TUTORIAL_VIDEOS_PAGE_SIZE,
  );
  const visibleTutorials = getFeedPageSlice(
    tutorials,
    effectivePageStart,
    TUTORIAL_VIDEOS_PAGE_SIZE,
  );

  const openCollection = () =>
    router.push(`/single-collection?id=${section.id}`);

  const movePrev = useCallback(() => {
    setPageStart((prev) => Math.max(prev - TUTORIAL_VIDEOS_PAGE_SIZE, 0));
  }, []);

  const moveNext = useCallback(() => {
    if (!canSlide) return;
    setPageStart((prev) =>
      Math.min(
        prev + TUTORIAL_VIDEOS_PAGE_SIZE,
        totalItems - TUTORIAL_VIDEOS_PAGE_SIZE,
      ),
    );
  }, [canSlide, totalItems]);

  if (isQuickguides) {
    if (quickguideItems.length === 0) return null;

    return (
      <TutorialSection id={section.id}>
        <SectionHeader>
          <SectionTag>
            <MonoText $use="H4_Medium">{section.title}</MonoText>
          </SectionTag>
        </SectionHeader>
        <Grid $columnMax="350px" $alignStart>
          {quickguideItems.map((guide) => (
            <QuickguideItemCard
              key={guide.id}
              guide={guide}
              freeLabel={freeLabel}
            />
          ))}
        </Grid>
      </TutorialSection>
    );
  }

  if (tutorials.length === 0) return null;

  return (
    <TutorialSection id={section.id}>
      <SectionHeader>
        <SectionLabel onClick={openCollection}>
          <SectionTag>
            <MonoText $use="H4_Medium">{section.title}</MonoText>
          </SectionTag>
          <LeftIcon />
        </SectionLabel>
        {canSlide ? (
          <HeaderActions>
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
          </HeaderActions>
        ) : null}
      </SectionHeader>
      <Grid
        $columns={TUTORIAL_VIDEOS_PAGE_SIZE}
        $maxWidth={section.gridMaxWidth ?? undefined}
      >
        {visibleTutorials.map((tutorial) => (
          <TutorialCard key={tutorial.id} tutorial={tutorial} />
        ))}
      </Grid>
    </TutorialSection>
  );
}

export default function TutorialContent() {
  const { t } = useTranslation();
  const { sections, freeLabel, isLoading } = useTutorialVideos();

  useEffect(() => {
    scrollToSectionHash();
    const retry = window.setTimeout(scrollToSectionHash, 100);
    window.addEventListener("hashchange", scrollToSectionHash);
    return () => {
      window.clearTimeout(retry);
      window.removeEventListener("hashchange", scrollToSectionHash);
    };
  }, []);

  if (isLoading) {
    return (
      <Content>
        <HeroBlock>
          <MonoText $use="Heading1">{t("tutorialVideos.heroTitle")}</MonoText>
          <HeroSubtitle>
            <MonoText $use="H4_Medium">
              {t("tutorialVideos.heroSubtitle")}
            </MonoText>
          </HeroSubtitle>
        </HeroBlock>
        <TutorialSection>
          <Skeleton.Header />
          <TutorialSectionSkeleton />
        </TutorialSection>
      </Content>
    );
  }

  return (
    <Content>
      <HeroBlock>
        <MonoText $use="Heading1">{t("tutorialVideos.heroTitle")}</MonoText>
        <HeroSubtitle>
          <MonoText $use="H4_Medium">
            {t("tutorialVideos.heroSubtitle")}
          </MonoText>
        </HeroSubtitle>
      </HeroBlock>
      {sections.map((section) => (
        <TutorialSectionRow
          key={section.id}
          section={section}
          freeLabel={freeLabel}
        />
      ))}
    </Content>
  );
}
