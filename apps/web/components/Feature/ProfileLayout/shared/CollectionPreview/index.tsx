"use client";

import { useMemo } from "react";
import { useProfileHomeCollections } from "@/hooks/useProfileHomeCollections";
import { LeftIcon } from "@/assets/icons";
import TutorialCard from "@/components/Feature/TutorialVideos/TutorialCard";
import {
  SectionHeader,
  SectionLabel,
  SectionLink,
} from "@/components/Feature/TutorialVideos/TutorialContent/styles";
import { MonoText } from "@/components/UI/Monotext";
import Skeleton from "@/components/UI/Skeleton";
import { useCreatorChannelProfile } from "@/hooks/useCreatorChannelProfile";
import { useCreatorProfileUi } from "@/hooks/useCreatorChannelLayout";
import { matchesProfileSearch } from "@/utils/creatorChannel";
import {
  COLLECTION_PREVIEW_LIMIT,
  COLLECTION_PREVIEW_START,
} from "@/utils/Constants";
import { pathPublicCollection } from "@/utils/path";
import {
  CollectionSection,
  CollectionSectionTag,
  FourColumnGrid,
} from "./styles";
import { ProfileLayoutVariant } from "../../config";

type Props = {
  variant: ProfileLayoutVariant;
};

function PrivateCollectionPreview({
  variant,
  searchQuery,
  displayName,
}: {
  variant: ProfileLayoutVariant;
  searchQuery: string;
  displayName: string;
}) {
  const { data: sections = [] } = useProfileHomeCollections(displayName);

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

  if (!visibleSections.length) return null;

  return (
    <>
      {visibleSections.map((collection) => {
        const hasMore = collection.cards.length > COLLECTION_PREVIEW_LIMIT;
        const displayedCards = collection.cards.slice(
          COLLECTION_PREVIEW_START,
          COLLECTION_PREVIEW_LIMIT,
        );
        return (
          <CollectionSection key={collection.id} $variant={variant}>
            <SectionHeader>
              <SectionLabel>
                <CollectionSectionTag>
                  <MonoText $use="H4_Medium">{collection.name}</MonoText>
                </CollectionSectionTag>
              </SectionLabel>
              {hasMore && (
                <SectionLink href={`/single-collection?id=${collection.id}`}>
                  <LeftIcon />
                </SectionLink>
              )}
            </SectionHeader>
            <FourColumnGrid>
              {displayedCards.map((tutorial) => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
            </FourColumnGrid>
          </CollectionSection>
        );
      })}
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
        <CollectionSection key={collection.id} $variant={variant}>
          <SectionHeader>
            <SectionLabel>
              <CollectionSectionTag>
                <MonoText $use="H4_Medium">{collection.name}</MonoText>
              </CollectionSectionTag>
            </SectionLabel>
            {collection.cards.length > COLLECTION_PREVIEW_LIMIT && (
              <SectionLink
                href={pathPublicCollection(collection.id, publicCreatorId)}
              >
                <LeftIcon />
              </SectionLink>
            )}
          </SectionHeader>
          <FourColumnGrid>
            {collection.cards
              .slice(COLLECTION_PREVIEW_START, COLLECTION_PREVIEW_LIMIT)
              .map((tutorial) => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
          </FourColumnGrid>
        </CollectionSection>
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
