"use client";

import { useMemo, useState, useCallback } from "react";
import { useProfileHomeCollections } from "@/hooks/useProfileHomeCollections";
import { LeftIcon } from "@/assets/icons";
import TutorialCard from "@/components/Feature/TutorialVideos/TutorialCard";
import {
  SectionHeader,
  SectionLabel,
  SectionLink,
} from "@/components/Feature/TutorialVideos/TutorialContent/styles";
import {
  HeaderActions,
  SectionArrow,
  SectionArrows,
} from "@/components/Feature/ExploreCreators/RecentlyAdded/styles";
import { MonoText } from "@/components/UI/Monotext";
import Skeleton from "@/components/UI/Skeleton";
import { useCreatorChannelProfile } from "@/hooks/useCreatorChannelProfile";
import { useCreatorProfileUi } from "@/hooks/useCreatorChannelLayout";
import { matchesProfileSearch } from "@/utils/creatorChannel";
import {
  COLLECTION_PREVIEW_LIMIT,
  COLLECTION_PREVIEW_START,
} from "@/utils/Constants";
import { getPaginationState } from "@/utils/feedContentToTutorial";
import { pathPublicCollection } from "@/utils/path";
import type { TutorialVideo } from "@/utils/types";
import {
  CollectionSection,
  CollectionSectionTag,
  FourColumnGrid,
} from "./styles";
import { ProfileLayoutVariant } from "../../config";

type Props = {
  variant: ProfileLayoutVariant;
};

type CollectionData = {
  id: string;
  name: string;
  cards: TutorialVideo[];
};

function CollectionPreviewItem({
  collection,
  variant,
  href,
}: {
  collection: CollectionData;
  variant: ProfileLayoutVariant;
  href: string;
}) {
  const [pageStart, setPageStart] = useState(0);
  const totalItems = collection.cards.length;
  const pageSize = COLLECTION_PREVIEW_LIMIT;

  const { canSlide, canGoPrev, canGoNext } = getPaginationState(
    totalItems,
    pageStart,
    pageSize,
  );

  const movePrev = useCallback(() => {
    setPageStart((prev) => Math.max(prev - pageSize, 0));
  }, [pageSize]);

  const moveNext = useCallback(() => {
    if (!canSlide) return;
    setPageStart((prev) =>
      Math.min(prev + pageSize, Math.max(totalItems - pageSize, 0)),
    );
  }, [canSlide, pageSize, totalItems]);

  const displayedCards = useMemo(
    () => collection.cards.slice(pageStart, pageStart + pageSize),
    [collection.cards, pageStart, pageSize],
  );

  return (
    <CollectionSection key={collection.id} $variant={variant}>
      <SectionHeader>
        <SectionLabel>
          <CollectionSectionTag>
            <MonoText $use="H4_Medium">{collection.name}</MonoText>
          </CollectionSectionTag>
          <SectionLink href={href}>
            <LeftIcon />
          </SectionLink>
        </SectionLabel>
        <HeaderActions>
          {canSlide ? (
            <SectionArrows>
              {canGoPrev && (
                <SectionArrow
                  type="button"
                  onClick={movePrev}
                  aria-label="Previous items"
                >
                  <LeftIcon style={{ transform: "rotate(180deg)" }} />
                </SectionArrow>
              )}
              {canGoNext && (
                <SectionArrow
                  type="button"
                  onClick={moveNext}
                  aria-label="Next items"
                >
                  <LeftIcon />
                </SectionArrow>
              )}
            </SectionArrows>
          ) : null}
        </HeaderActions>
      </SectionHeader>
      <FourColumnGrid>
        {displayedCards.map((tutorial) => (
          <TutorialCard key={tutorial.id} tutorial={tutorial} />
        ))}
      </FourColumnGrid>
    </CollectionSection>
  );
}

function PrivateCollectionPreview({
  variant,
  searchQuery,
  displayName,
}: {
  variant: ProfileLayoutVariant;
  searchQuery: string;
  displayName: string;
}) {
  const { data: sections = [], isLoading } =
    useProfileHomeCollections(displayName);

  const visibleSections = useMemo(() => {
    const limited = sections.slice(0, 4);
    if (!searchQuery.trim()) return limited;

    return limited
      .map((section) => ({
        ...section,
        cards: section.cards.filter((card) =>
          matchesProfileSearch(searchQuery, card.title),
        ),
      }))
      .filter((section) => section.cards.length > 0);
  }, [searchQuery, sections]);

  if (isLoading) {
    return (
      <CollectionSection $variant={variant}>
        <FourColumnGrid>
          {Array.from({ length: COLLECTION_PREVIEW_LIMIT }).map((_, i) => (
            <Skeleton.Card key={i} />
          ))}
        </FourColumnGrid>
      </CollectionSection>
    );
  }

  if (!visibleSections.length) return null;

  return (
    <>
      {visibleSections.map((collection) => (
        <CollectionPreviewItem
          key={collection.id}
          collection={collection}
          variant={variant}
          href={`/single-collection?id=${collection.id}`}
        />
      ))}
    </>
  );
}

function PublicCollectionPreview({
  variant,
  publicCreatorId,
  searchQuery,
  displayName,
}: {
  variant: ProfileLayoutVariant;
  publicCreatorId: string;
  searchQuery: string;
  displayName: string;
}) {
  const { data: tutorials = [], isLoading } = useProfileHomeCollections(
    displayName,
    true,
    publicCreatorId,
  );

  const cardsWithSeeContent = useMemo(() => tutorials, [tutorials]);

  const visibleCards = useMemo(() => {
    const limited = cardsWithSeeContent.slice(
      COLLECTION_PREVIEW_START,
      COLLECTION_PREVIEW_LIMIT,
    );
    if (!searchQuery.trim()) return limited;

    return limited
      .map((section) => ({
        ...section,
        cards: section.cards.filter((card) =>
          matchesProfileSearch(searchQuery, card.title),
        ),
      }))
      .filter((section) => section.cards.length > 0);
  }, [cardsWithSeeContent, searchQuery]);

  if (isLoading) {
    return (
      <CollectionSection $variant={variant}>
        <FourColumnGrid>
          {Array.from({ length: COLLECTION_PREVIEW_LIMIT }).map((_, i) => (
            <Skeleton.Card key={i} />
          ))}
        </FourColumnGrid>
      </CollectionSection>
    );
  }

  if (!visibleCards.length) return null;

  return (
    <>
      {visibleCards.map((collection) => (
        <CollectionPreviewItem
          key={collection.id}
          collection={collection}
          variant={variant}
          href={pathPublicCollection(collection.id, publicCreatorId)}
        />
      ))}
    </>
  );
}

export default function CollectionPreview({ variant }: Props) {
  const { searchQuery } = useCreatorProfileUi();
  const { displayName, isPublicView, publicCreatorId } =
    useCreatorChannelProfile();

  if (isPublicView && publicCreatorId) {
    return (
      <PublicCollectionPreview
        variant={variant}
        publicCreatorId={publicCreatorId}
        searchQuery={searchQuery}
        displayName={displayName}
      />
    );
  }

  return (
    <PrivateCollectionPreview
      variant={variant}
      searchQuery={searchQuery}
      displayName={displayName}
    />
  );
}
