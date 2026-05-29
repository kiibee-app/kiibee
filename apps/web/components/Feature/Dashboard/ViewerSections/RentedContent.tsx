"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  type RentedMediaItem,
  type RentedMode,
} from "@/utils/dummyData/viewerRentedMockData";
import { PageWrap, SectionBlock } from "./styles";
import {
  RENTED_SECTION_KEYS,
  RENTED_MODES,
  filterCollections,
  filterMedia,
  getRentedContentSources,
  isViewerCollectionsSectionExpanded,
  syncViewerCollectionsSectionParam,
} from "@/utils/viewerRented";
import { CONTENT_COLLECTION_QUERY_KEY } from "@/utils/Constants";
import { useViewerRentedSectionPagination } from "@/hooks/RentedSectionPagination";
import RentedHeader from "./RentedHeader";
import CollectionsSection from "./CollectionsSection";
import MediaSections from "./MediaSections";
import PurchasedCollectionDetail from "./PurchasedCollectionDetail";

type Props = {
  title: string;
  mode: RentedMode;
  initialCollectionsExpanded?: boolean;
};

export default function RentedContent({
  title,
  mode,
  initialCollectionsExpanded = false,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams?.toString() ?? "";

  const [searchValue, setSearchValue] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isCollectionsExpanded = useMemo(() => {
    if (searchParamsString) {
      return isViewerCollectionsSectionExpanded(
        new URLSearchParams(searchParamsString),
      );
    }
    return initialCollectionsExpanded;
  }, [searchParamsString, initialCollectionsExpanded]);

  const setCollectionsExpanded = useCallback(
    (expanded: boolean) => {
      const params = new URLSearchParams(searchParamsString);
      syncViewerCollectionsSectionParam(params, expanded);

      const query = params.toString();
      const nextUrl = query ? `${pathname}?${query}` : pathname;

      router.replace(nextUrl, { scroll: false });
    },
    [pathname, router, searchParamsString],
  );
  const {
    getVisibleItems,
    canSlide,
    moveNext,
    movePrev,
    canGoPrev,
    canGoNext,
  } = useViewerRentedSectionPagination();
  const sources = useMemo(() => getRentedContentSources(mode), [mode]);
  const selectedCollectionId =
    mode === RENTED_MODES.PURCHASED
      ? searchParams?.get(CONTENT_COLLECTION_QUERY_KEY)
      : null;

  const filteredCollections = filterCollections(
    searchValue,
    sources.collections,
  );
  const filteredVideos = filterMedia(searchValue, sources.videos);
  const filteredAudios = filterMedia(searchValue, sources.audios);
  const filteredPdfs = filterMedia(searchValue, sources.pdfs);

  const visibleCollections = getVisibleItems(
    RENTED_SECTION_KEYS.COLLECTIONS,
    filteredCollections,
  );
  const visibleVideos = getVisibleItems(
    RENTED_SECTION_KEYS.VIDEOS,
    filteredVideos,
  );
  const visibleAudios = getVisibleItems(
    RENTED_SECTION_KEYS.AUDIOS,
    filteredAudios,
  );
  const visiblePdfs = getVisibleItems(RENTED_SECTION_KEYS.PDFS, filteredPdfs);
  const sectionTotals = {
    [RENTED_SECTION_KEYS.VIDEOS]: filteredVideos.length,
    [RENTED_SECTION_KEYS.AUDIOS]: filteredAudios.length,
    [RENTED_SECTION_KEYS.PDFS]: filteredPdfs.length,
  } as const;

  const sectionItems: Record<"videos" | "audios" | "pdfs", RentedMediaItem[]> =
    {
      [RENTED_SECTION_KEYS.VIDEOS]: visibleVideos,
      [RENTED_SECTION_KEYS.AUDIOS]: visibleAudios,
      [RENTED_SECTION_KEYS.PDFS]: visiblePdfs,
    };

  const selectedCollection = useMemo(
    () =>
      selectedCollectionId
        ? sources.collections.find((item) => item.id === selectedCollectionId)
        : undefined,
    [selectedCollectionId, sources.collections],
  );

  const selectedCollectionMedia = useMemo(() => {
    if (!selectedCollection) return [];

    return [...sources.videos, ...sources.audios, ...sources.pdfs].filter(
      (item) =>
        item.author === selectedCollection.author ||
        item.title === selectedCollection.title,
    );
  }, [selectedCollection, sources.audios, sources.pdfs, sources.videos]);

  const handleOpenCollection = useCallback(
    (collectionId: string) => {
      const params = new URLSearchParams(searchParamsString);
      params.set(CONTENT_COLLECTION_QUERY_KEY, collectionId);
      const query = params.toString();
      const nextUrl = query ? `${pathname}?${query}` : pathname;
      router.replace(nextUrl, { scroll: false });
    },
    [pathname, router, searchParamsString],
  );

  const handleCloseCollection = useCallback(() => {
    const params = new URLSearchParams(searchParamsString);
    params.delete(CONTENT_COLLECTION_QUERY_KEY);
    const query = params.toString();
    const nextUrl = query ? `${pathname}?${query}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }, [pathname, router, searchParamsString]);

  if (mode === RENTED_MODES.PURCHASED && selectedCollectionId) {
    return (
      <PageWrap>
        <PurchasedCollectionDetail
          collection={selectedCollection}
          mediaItems={selectedCollectionMedia}
          onBack={handleCloseCollection}
        />
      </PageWrap>
    );
  }

  return (
    <PageWrap $expandedCollections={isCollectionsExpanded}>
      <RentedHeader
        title={title}
        mode={mode}
        searchValue={searchValue}
        isSearchOpen={isSearchOpen}
        onSearchChange={setSearchValue}
        onToggleSearch={() => setIsSearchOpen((prev) => !prev)}
        searchInputRef={searchInputRef}
        onBackClick={
          isCollectionsExpanded
            ? () => setCollectionsExpanded(false)
            : undefined
        }
      />

      <SectionBlock>
        <CollectionsSection
          mode={mode}
          items={
            isCollectionsExpanded ? filteredCollections : visibleCollections
          }
          totalItems={filteredCollections.length}
          canSlide={canSlide}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
          movePrev={movePrev}
          moveNext={moveNext}
          onOpenSection={() => setCollectionsExpanded(true)}
          showOpenSectionArrow={!isCollectionsExpanded}
          showExpandedMetaHeader={isCollectionsExpanded}
          onCollectionPrimaryAction={(item) => handleOpenCollection(item.id)}
        />
      </SectionBlock>

      {isCollectionsExpanded ? null : (
        <MediaSections
          mode={mode}
          sectionItems={sectionItems}
          sectionTotals={sectionTotals}
          canSlide={canSlide}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
          movePrev={movePrev}
          moveNext={moveNext}
        />
      )}
    </PageWrap>
  );
}
