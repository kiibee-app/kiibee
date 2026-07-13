"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import COLORS from "@repo/ui/colors";
import { MonoText } from "@/components/UI/Monotext";
import { PageWrap, SectionBlock, EmptyState } from "./styles";
import {
  RENTED_SECTION_KEYS,
  RENTED_MODES,
  type RentedMode,
  type RentedSectionKey,
  type RentedCollectionItem,
  type RentedMediaItem,
  filterCollections,
  filterMedia,
  getRentedMediaSectionItems,
  getViewerExpandedSection,
  syncViewerExpandedSectionParam,
} from "@/utils/viewerRented";
import {
  CONTENT_COLLECTION_QUERY_KEY,
  CONTENT_ITEM_QUERY_KEY,
} from "@/utils/Constants";
import { useViewerRentedSectionPagination } from "@/hooks/RentedSectionPagination";
import { useViewerRentedData } from "@/hooks/useViewerRented";
import { useViewerPurchased } from "@/hooks/viewer/useViewerPurchased";
import RentedHeader from "./RentedHeader";
import CollectionsSection from "./CollectionsSection";
import MediaSections from "./MediaSections";
import PurchasedCollectionDetail from "./PurchasedCollectionDetail";
import ViewerEmptyState from "./ViewerEmptyState";
import { pathPublishedContent } from "@/utils/path";
import { useProtectedContentNavigation } from "@/hooks/useProtectedContentNavigation";

type Props = {
  title: string;
  mode: RentedMode;
  initialExpandedSection?: string | null;
};

export default function RentedContent({
  title,
  mode,
  initialExpandedSection = null,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams?.toString() ?? "";
  const { navigateToContent } = useProtectedContentNavigation();

  const [searchValue, setSearchValue] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const expandedSection = useMemo(() => {
    if (searchParamsString) {
      return getViewerExpandedSection(new URLSearchParams(searchParamsString));
    }
    return initialExpandedSection as RentedSectionKey | null;
  }, [searchParamsString, initialExpandedSection]);

  const setExpandedSection = useCallback(
    (sectionKey: RentedSectionKey | null) => {
      const params = new URLSearchParams(searchParamsString);
      syncViewerExpandedSectionParam(params, sectionKey);

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
  const { sources: rentedSources, isLoading } = useViewerRentedData(mode);
  const { data: purchasedData, isLoading: isPurchasedLoading } =
    useViewerPurchased(mode === RENTED_MODES.PURCHASED);

  const sources = useMemo(() => {
    if (mode === RENTED_MODES.PURCHASED) {
      return (
        purchasedData || {
          collections: [],
          videos: [],
          audios: [],
          pdfs: [],
          webs: [],
        }
      );
    }
    return rentedSources;
  }, [mode, purchasedData, rentedSources]);
  const selectedCollectionId = searchParams?.get(CONTENT_COLLECTION_QUERY_KEY);
  const selectedContentId = searchParams?.get(CONTENT_ITEM_QUERY_KEY);

  const filteredCollections = filterCollections(
    searchValue,
    sources.collections,
  );
  const filteredVideos = filterMedia(searchValue, sources.videos);
  const filteredAudios = filterMedia(searchValue, sources.audios);
  const filteredPdfs = filterMedia(searchValue, sources.pdfs);
  const filteredWebs = filterMedia(searchValue, sources.webs || []);

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
  const visibleWebs = getVisibleItems(RENTED_SECTION_KEYS.WEBS, filteredWebs);
  const sectionTotals = {
    [RENTED_SECTION_KEYS.VIDEOS]: filteredVideos.length,
    [RENTED_SECTION_KEYS.AUDIOS]: filteredAudios.length,
    [RENTED_SECTION_KEYS.PDFS]: filteredPdfs.length,
    [RENTED_SECTION_KEYS.WEBS]: filteredWebs.length,
  } as const;

  const sectionItems = getRentedMediaSectionItems({
    videos: visibleVideos,
    audios: visibleAudios,
    pdfs: visiblePdfs,
    webs: visibleWebs,
  });

  const hasNoResults =
    filteredCollections.length === 0 &&
    filteredVideos.length === 0 &&
    filteredAudios.length === 0 &&
    filteredPdfs.length === 0 &&
    filteredWebs.length === 0;

  const isSearchEmpty = searchValue.trim() !== "" && hasNoResults;
  const isDataEmpty = searchValue.trim() === "" && hasNoResults;

  const selectedCollection = useMemo(
    () =>
      selectedCollectionId
        ? sources.collections.find((item) => item.id === selectedCollectionId)
        : undefined,
    [selectedCollectionId, sources.collections],
  );

  const selectedCollectionMedia = useMemo(() => {
    if (!selectedCollection) return [];

    return [
      ...sources.videos,
      ...sources.audios,
      ...sources.pdfs,
      ...(sources.webs || []),
    ].filter(
      (item) =>
        item.author === selectedCollection.author ||
        item.title === selectedCollection.title,
    );
  }, [
    selectedCollection,
    sources.audios,
    sources.pdfs,
    sources.videos,
    sources.webs,
  ]);

  const findMatchingCollection = useCallback(
    (item: RentedMediaItem): RentedCollectionItem | undefined =>
      sources.collections.find(
        (collection) =>
          collection.title === item.title && collection.author === item.author,
      ),
    [sources.collections],
  );

  const handleOpenCollection = useCallback(
    (collectionId: string) => {
      const params = new URLSearchParams(searchParamsString);
      params.set(CONTENT_COLLECTION_QUERY_KEY, collectionId);
      params.delete(CONTENT_ITEM_QUERY_KEY);
      const query = params.toString();
      const nextUrl = query ? `${pathname}?${query}` : pathname;
      router.replace(nextUrl, { scroll: false });
    },
    [pathname, router, searchParamsString],
  );

  const handleOpenMediaDetail = useCallback(
    (item: RentedMediaItem) => {
      const collection = findMatchingCollection(item);
      if (!collection) return;

      const params = new URLSearchParams(searchParamsString);
      params.set(CONTENT_COLLECTION_QUERY_KEY, collection.id);
      params.set(CONTENT_ITEM_QUERY_KEY, item.id);
      const query = params.toString();
      const nextUrl = query ? `${pathname}?${query}` : pathname;
      router.replace(nextUrl, { scroll: false });
    },
    [findMatchingCollection, pathname, router, searchParamsString],
  );

  const handleCardClick = useCallback(
    (id: string) => {
      navigateToContent(pathPublishedContent(id), true);
    },
    [navigateToContent],
  );

  const handleCloseCollection = useCallback(() => {
    const params = new URLSearchParams(searchParamsString);
    params.delete(CONTENT_COLLECTION_QUERY_KEY);
    params.delete(CONTENT_ITEM_QUERY_KEY);
    const query = params.toString();
    const nextUrl = query ? `${pathname}?${query}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }, [pathname, router, searchParamsString]);

  const handleSelectDetailMedia = useCallback(
    (mediaId: string) => {
      const params = new URLSearchParams(searchParamsString);
      params.set(CONTENT_ITEM_QUERY_KEY, mediaId);
      const query = params.toString();
      const nextUrl = query ? `${pathname}?${query}` : pathname;
      router.replace(nextUrl, { scroll: false });
    },
    [pathname, router, searchParamsString],
  );

  if (selectedCollectionId) {
    return (
      <PageWrap>
        <PurchasedCollectionDetail
          collection={selectedCollection}
          mediaItems={selectedCollectionMedia}
          onBack={handleCloseCollection}
          initialSelectedMediaId={selectedContentId}
          onSelectMedia={handleSelectDetailMedia}
          title={title}
          mode={mode}
        />
      </PageWrap>
    );
  }

  return (
    <PageWrap
      $expandedCollections={expandedSection === RENTED_SECTION_KEYS.COLLECTIONS}
    >
      <RentedHeader
        title={title}
        mode={mode}
        searchValue={searchValue}
        isSearchOpen={isSearchOpen}
        onSearchChange={setSearchValue}
        onToggleSearch={() => setIsSearchOpen((prev) => !prev)}
        searchInputRef={searchInputRef}
        onBackClick={
          expandedSection ? () => setExpandedSection(null) : undefined
        }
      />

      {(mode === RENTED_MODES.PURCHASED ? isPurchasedLoading : isLoading) ? (
        <EmptyState>
          <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
            Loading...
          </MonoText>
        </EmptyState>
      ) : isDataEmpty ? (
        <ViewerEmptyState mode={mode} variant="empty" />
      ) : isSearchEmpty ? (
        <ViewerEmptyState mode={mode} variant="search" />
      ) : (
        <>
          {filteredCollections.length > 0 &&
            (!expandedSection ||
              expandedSection === RENTED_SECTION_KEYS.COLLECTIONS) && (
              <SectionBlock>
                <CollectionsSection
                  mode={mode}
                  items={
                    expandedSection === RENTED_SECTION_KEYS.COLLECTIONS
                      ? filteredCollections
                      : visibleCollections
                  }
                  totalItems={filteredCollections.length}
                  canSlide={canSlide}
                  canGoPrev={canGoPrev}
                  canGoNext={canGoNext}
                  movePrev={movePrev}
                  moveNext={moveNext}
                  onOpenSection={() =>
                    setExpandedSection(RENTED_SECTION_KEYS.COLLECTIONS)
                  }
                  showOpenSectionArrow={
                    expandedSection !== RENTED_SECTION_KEYS.COLLECTIONS
                  }
                  showExpandedMetaHeader={
                    expandedSection === RENTED_SECTION_KEYS.COLLECTIONS
                  }
                  onCollectionPrimaryAction={(item) =>
                    handleOpenCollection(item.id)
                  }
                  onCollectionClick={(item) => handleCardClick(item.id)}
                />
              </SectionBlock>
            )}

          {expandedSection === RENTED_SECTION_KEYS.COLLECTIONS ? null : (
            <MediaSections
              mode={mode}
              sectionItems={
                expandedSection
                  ? {
                      [RENTED_SECTION_KEYS.VIDEOS]:
                        expandedSection === RENTED_SECTION_KEYS.VIDEOS
                          ? filteredVideos
                          : [],
                      [RENTED_SECTION_KEYS.AUDIOS]:
                        expandedSection === RENTED_SECTION_KEYS.AUDIOS
                          ? filteredAudios
                          : [],
                      [RENTED_SECTION_KEYS.PDFS]:
                        expandedSection === RENTED_SECTION_KEYS.PDFS
                          ? filteredPdfs
                          : [],
                      [RENTED_SECTION_KEYS.WEBS]:
                        expandedSection === RENTED_SECTION_KEYS.WEBS
                          ? filteredWebs
                          : [],
                    }
                  : sectionItems
              }
              expandedSection={expandedSection || null}
              sectionTotals={sectionTotals}
              canSlide={canSlide}
              canGoPrev={canGoPrev}
              canGoNext={canGoNext}
              movePrev={movePrev}
              moveNext={moveNext}
              onMediaPrimaryAction={handleOpenMediaDetail}
              onCardClick={(item) => handleCardClick(item.id)}
              onOpenSection={(sectionKey) => {
                setExpandedSection(sectionKey);
              }}
            />
          )}
        </>
      )}
    </PageWrap>
  );
}
