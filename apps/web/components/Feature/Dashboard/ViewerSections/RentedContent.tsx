"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams, useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import COLORS from "@repo/ui/colors";
import LeftIcon from "@/assets/icons/LeftIcon";
import { MonoText } from "@/components/UI/Monotext";
import {
  SectionBlock,
  EmptyState,
  HeaderBackButton,
  HeaderTitleWrap,
  PageHeader,
} from "./styles";
import { DashboardPageWrapper } from "@/components/Layout/Dashboard/styles";
import {
  RENTED_SECTION_KEYS,
  RENTED_MODES,
  type RentedMode,
  type RentedSectionKey,
  type RentedMediaItem,
  filterCollections,
  filterMedia,
  getRentedMediaSectionItems,
  getViewerExpandedSection,
  mergeRentedContentSources,
  syncViewerExpandedSectionParam,
} from "@/utils/viewerRented";
import {
  CONTENT_COLLECTION_QUERY_KEY,
  CONTENT_ITEM_QUERY_KEY,
  LOADING_TEXT_FALLBACK,
} from "@/utils/Constants";
import { useViewerRentedSectionPagination } from "@/hooks/RentedSectionPagination";
import { useViewerRentedData } from "@/hooks/useViewerRented";
import { useViewerPurchased } from "@/hooks/viewer/useViewerPurchased";
import RentedHeader from "./RentedHeader";
import CollectionsSection from "./CollectionsSection";
import MediaSections from "./MediaSections";
import ViewerEmptyState from "./ViewerEmptyState";
import PublishedContentDetail from "@/components/Feature/SingleContentPage/PublishedContentDetail";
import SingleCollectionDetail from "@/components/Feature/SingleCollectionHero/SingleCollectionDetail";
import { DetailTopWrap } from "./purchasedCollectionDetail.styles";

const slugify = (text: string) => {
  if (!text) return "";
  let str = text.toString().toLowerCase().trim();
  const sets = [
    { to: 'ae', from: '[æä]' },
    { to: 'oe', from: '[øö]' },
    { to: 'aa', from: '[å]' },
  ];
  sets.forEach(set => {
    str = str.replace(new RegExp(set.from, 'gi'), set.to);
  });
  return str
    .replace(/\s+/g, '-') 
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-') 
    .replace(/^-+/, '') 
    .replace(/-+$/, '');
};

const mapMediaTypeToSlug = (mediaType: string, lang: string) => {
  const type = mediaType.toLowerCase();
  if (lang === 'da') {
    switch (type) {
      case "video": return "video";
      case "audio": return "lyd-fil";
      case "pdf": return "pdf";
      case "epub": return "epub";
      case "web": return "web-indhold";
      default: return type;
    }
  }
  return type;
};

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
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams?.toString() ?? "";
  const params = useParams();
  const slug = params?.slug as string[] | undefined;

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
  const {
    sources: rentedSources,
    isLoading,
    isFetching,
  } = useViewerRentedData(mode);
  const {
    sources: previouslyRentedSources,
    isLoading: isPreviouslyRentedLoading,
    isFetching: isPreviouslyRentedFetching,
  } = useViewerRentedData(RENTED_MODES.PREVIOUSLY, true);
  const {
    data: purchasedData,
    isLoading: isPurchasedLoading,
    isFetching: isPurchasedFetching,
  } = useViewerPurchased(true);

  const sources = useMemo(() => {
    const purchasedAndPreviousMerged = mergeRentedContentSources(
      purchasedData,
      previouslyRentedSources,
    );
    if (mode === RENTED_MODES.PURCHASED) {
      return purchasedAndPreviousMerged;
    }
    const hasRentedData =
      rentedSources.collections.length > 0 ||
      rentedSources.videos.length > 0 ||
      rentedSources.audios.length > 0 ||
      rentedSources.pdfs.length > 0 ||
      rentedSources.epubs.length > 0 ||
      rentedSources.webs.length > 0;

    return hasRentedData ? rentedSources : purchasedAndPreviousMerged;
  }, [mode, purchasedData, previouslyRentedSources, rentedSources]);

  const isHistoryLoading =
    isPurchasedLoading ||
    isPurchasedFetching ||
    isPreviouslyRentedLoading ||
    isPreviouslyRentedFetching;
  const isContentView = slug && slug.length === 2 && ["video", "lyd-fil", "audio", "pdf", "epub", "web", "web-indhold"].includes(slug[0].toLowerCase());
  const selectedContentSlug = isContentView ? slug[1] : undefined;
  const selectedContentId = searchParams?.get(CONTENT_ITEM_QUERY_KEY);
  const selectedCollectionId = searchParams?.get(CONTENT_COLLECTION_QUERY_KEY);

  const filteredCollections = filterCollections(
    searchValue,
    sources.collections,
  );
  const filteredVideos = filterMedia(searchValue, sources.videos);
  const filteredAudios = filterMedia(searchValue, sources.audios);
  const filteredPdfs = filterMedia(searchValue, sources.pdfs);
  const filteredEpubs = filterMedia(searchValue, sources.epubs || []);
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
  const visibleEpubs = getVisibleItems(
    RENTED_SECTION_KEYS.EPUBS,
    filteredEpubs,
  );
  const visibleWebs = getVisibleItems(RENTED_SECTION_KEYS.WEBS, filteredWebs);
  const sectionTotals = {
    [RENTED_SECTION_KEYS.VIDEOS]: filteredVideos.length,
    [RENTED_SECTION_KEYS.AUDIOS]: filteredAudios.length,
    [RENTED_SECTION_KEYS.PDFS]: filteredPdfs.length,
    [RENTED_SECTION_KEYS.EPUBS]: filteredEpubs.length,
    [RENTED_SECTION_KEYS.WEBS]: filteredWebs.length,
  } as const;

  const sectionItems = getRentedMediaSectionItems({
    videos: visibleVideos,
    audios: visibleAudios,
    pdfs: visiblePdfs,
    epubs: visibleEpubs,
    webs: visibleWebs,
  });

  const hasNoResults =
    filteredCollections.length === 0 &&
    filteredVideos.length === 0 &&
    filteredAudios.length === 0 &&
    filteredPdfs.length === 0 &&
    filteredEpubs.length === 0 &&
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

  const selectedContent = useMemo(() => {
    if (selectedContentSlug) {
      return (
        sources.videos.find((item) => slugify(item.title) === selectedContentSlug) ||
        sources.audios.find((item) => slugify(item.title) === selectedContentSlug) ||
        sources.pdfs.find((item) => slugify(item.title) === selectedContentSlug) ||
        sources.epubs.find((item) => slugify(item.title) === selectedContentSlug) ||
        sources.webs.find((item) => slugify(item.title) === selectedContentSlug)
      );
    }
    if (selectedContentId) {
      return (
        sources.videos.find((item) => item.id === selectedContentId || item.title === selectedContentId) ||
        sources.audios.find((item) => item.id === selectedContentId || item.title === selectedContentId) ||
        sources.pdfs.find((item) => item.id === selectedContentId || item.title === selectedContentId) ||
        sources.epubs.find((item) => item.id === selectedContentId || item.title === selectedContentId) ||
        sources.webs.find((item) => item.id === selectedContentId || item.title === selectedContentId)
      );
    }
    return undefined;
  }, [selectedContentSlug, selectedContentId, sources]);

  const openMediaInDashboard = useCallback(
    (item: RentedMediaItem) => {
      const queryParams = new URLSearchParams(searchParamsString);
      queryParams.delete(CONTENT_COLLECTION_QUERY_KEY);
      queryParams.delete(CONTENT_ITEM_QUERY_KEY);
      const query = queryParams.toString();
      const mediaSlug = mapMediaTypeToSlug(item.mediaType, i18n.language);
      const titleSlug = slugify(item.title);
      const nextUrl = `/dashboard/viewer/${mediaSlug}/${titleSlug}${query ? `?${query}` : ""}`;
      router.replace(nextUrl, { scroll: false });
    },
    [router, searchParamsString],
  );

  const handleOpenCollection = useCallback(
    (collectionId: string) => {
      const queryParams = new URLSearchParams(searchParamsString);
      queryParams.set(CONTENT_COLLECTION_QUERY_KEY, collectionId);
      queryParams.delete(CONTENT_ITEM_QUERY_KEY);
      const query = queryParams.toString();
      const nextUrl = `/dashboard/viewer${query ? `?${query}` : ""}`;
      router.replace(nextUrl, { scroll: false });
    },
    [router, searchParamsString],
  );

  const handleCloseDetail = useCallback(() => {
    const queryParams = new URLSearchParams(searchParamsString);
    queryParams.delete(CONTENT_COLLECTION_QUERY_KEY);
    queryParams.delete(CONTENT_ITEM_QUERY_KEY);
    const query = queryParams.toString();
    const nextUrl = `/dashboard/viewer${query ? `?${query}` : ""}`;
    router.replace(nextUrl, { scroll: false });
  }, [router, searchParamsString]);

  const handleCloseContentDetail = useCallback(() => {
    const queryParams = new URLSearchParams(searchParamsString);
    queryParams.delete(CONTENT_ITEM_QUERY_KEY);
    const query = queryParams.toString();
    const nextUrl = `/dashboard/viewer${query ? `?${query}` : ""}`;
    router.replace(nextUrl, { scroll: false });
  }, [router, searchParamsString]);

  const handleSelectDetailMedia = useCallback(
    (mediaTitle: string) => {
      const item =
        sources.videos.find((i) => i.title === mediaTitle) ||
        sources.audios.find((i) => i.title === mediaTitle) ||
        sources.pdfs.find((i) => i.title === mediaTitle) ||
        sources.epubs?.find((i) => i.title === mediaTitle) ||
        sources.webs?.find((i) => i.title === mediaTitle);
      
      const mediaType = item?.mediaType || "video";
      const mediaSlug = mapMediaTypeToSlug(mediaType, i18n.language);
      const titleSlug = slugify(mediaTitle);
      const queryParams = new URLSearchParams(searchParamsString);
      queryParams.delete(CONTENT_ITEM_QUERY_KEY);
      const query = queryParams.toString();
      const nextUrl = `/dashboard/viewer/${mediaSlug}/${titleSlug}${query ? `?${query}` : ""}`;
      router.replace(nextUrl, { scroll: false });
    },
    [router, searchParamsString, sources],
  );

  const isSelectedCollectionLoading = Boolean(
    selectedCollectionId &&
    !selectedCollection &&
    (mode === RENTED_MODES.PURCHASED
      ? isHistoryLoading
      : isLoading || isFetching),
  );

  if (isSelectedCollectionLoading) {
    return (
      <DashboardPageWrapper>
        <EmptyState>
          <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
            {LOADING_TEXT_FALLBACK}
          </MonoText>
        </EmptyState>
      </DashboardPageWrapper>
    );
  }

  if (selectedContentSlug || selectedContentId) {
    return (
      <DashboardPageWrapper>
        <DetailTopWrap>
          <PageHeader $compact>
            <HeaderTitleWrap>
              <HeaderBackButton
                type="button"
                aria-label={t("common.back")}
                onClick={
                  selectedCollectionId
                    ? handleCloseContentDetail
                    : handleCloseDetail
                }
              >
                <LeftIcon style={{ transform: "rotate(180deg)" }} />
              </HeaderBackButton>
              <MonoText $use="H4_SemiBold">{selectedContent?.title || title}</MonoText>
            </HeaderTitleWrap>
          </PageHeader>
          <PublishedContentDetail
            contentKey={selectedContent?.id || selectedContentId || ""}
            onBack={
              selectedCollectionId
                ? handleCloseContentDetail
                : handleCloseDetail
            }
            showBack={false}
            embedded
          />
        </DetailTopWrap>
      </DashboardPageWrapper>
    );
  }

  if (selectedCollectionId) {
    return (
      <DashboardPageWrapper>
        <DetailTopWrap>
          <PageHeader $compact>
            <HeaderTitleWrap>
              <HeaderBackButton
                type="button"
                aria-label={t("common.back")}
                onClick={handleCloseDetail}
              >
                <LeftIcon style={{ transform: "rotate(180deg)" }} />
              </HeaderBackButton>
              <MonoText $use="H4_SemiBold">{title}</MonoText>
            </HeaderTitleWrap>
          </PageHeader>
          <SingleCollectionDetail
            collectionId={selectedCollectionId}
            onBack={handleCloseDetail}
            showBack={false}
            embedded
            onSelectContent={handleSelectDetailMedia}
          />
        </DetailTopWrap>
      </DashboardPageWrapper>
    );
  }

  return (
    <DashboardPageWrapper>
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

      {(mode === RENTED_MODES.PURCHASED ? isHistoryLoading : isLoading) ? (
        <EmptyState>
          <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
            {LOADING_TEXT_FALLBACK}
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
                  onCollectionClick={(item) => handleOpenCollection(item.id)}
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
                      [RENTED_SECTION_KEYS.EPUBS]:
                        expandedSection === RENTED_SECTION_KEYS.EPUBS
                          ? filteredEpubs
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
              onMediaPrimaryAction={openMediaInDashboard}
              onCardClick={openMediaInDashboard}
              onOpenSection={(sectionKey) => {
                setExpandedSection(sectionKey);
              }}
            />
          )}
        </>
      )}
    </DashboardPageWrapper>
  );
}
