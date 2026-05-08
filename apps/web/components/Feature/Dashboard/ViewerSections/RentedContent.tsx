"use client";

import { useMemo, useRef, useState } from "react";
import {
  type RentedMediaItem,
  type RentedMode,
} from "@/utils/dummyData/viewerRentedMockData";
import { PageWrap, SectionBlock } from "./styles";
import {
  RENTED_SECTION_KEYS,
  filterCollections,
  filterMedia,
  getRentedContentSources,
} from "@/utils/viewerRented";
import { useViewerRentedSectionPagination } from "@/hooks/RentedSectionPagination";
import RentedHeader from "./RentedHeader";
import CollectionsSection from "./CollectionsSection";
import MediaSections from "./MediaSections";

type Props = { title: string; mode: RentedMode };

export default function RentedContent({ title, mode }: Props) {
  const [searchValue, setSearchValue] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const {
    getVisibleItems,
    canSlide,
    moveNext,
    movePrev,
    canGoPrev,
    canGoNext,
  } = useViewerRentedSectionPagination();
  const sources = useMemo(() => getRentedContentSources(mode), [mode]);

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

  return (
    <PageWrap>
      <RentedHeader
        title={title}
        mode={mode}
        searchValue={searchValue}
        isSearchOpen={isSearchOpen}
        onSearchChange={setSearchValue}
        onToggleSearch={() => setIsSearchOpen((prev) => !prev)}
        searchInputRef={searchInputRef}
      />

      <SectionBlock>
        <CollectionsSection
          mode={mode}
          items={visibleCollections}
          totalItems={filteredCollections.length}
          canSlide={canSlide}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
          movePrev={movePrev}
          moveNext={moveNext}
        />
      </SectionBlock>

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
    </PageWrap>
  );
}
