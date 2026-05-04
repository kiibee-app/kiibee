"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MonoText } from "@/components/UI/Monotext";
import {
  MOCK_PURCHASED_AUDIOS,
  MOCK_PURCHASED_COLLECTIONS,
  MOCK_PURCHASED_PDFS,
  MOCK_PURCHASED_VIDEOS,
  type PurchasedMediaItem,
} from "@/utils/dummyData/viewerPurchasedMockData";
import CollectionsSection from "./Sections/CollectionsSection";
import VideosSection from "./Sections/VideosSection";
import AudiosSection from "./Sections/AudiosSection";
import PdfSection from "./Sections/PdfSection";
import { PageHeader, PageWrap } from "./styles";
import { SearchIcon } from "@/assets/icons/searchBarIcon";
import { DASHBOARD_VIEWER_PURCHASED } from "@/utils/translationKeys";

function matchesSearch(q: string, parts: string[]) {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return parts.some((p) => p.toLowerCase().includes(needle));
}

function filterMedia(
  searchValue: string,
  items: PurchasedMediaItem[],
): PurchasedMediaItem[] {
  return items.filter((v) =>
    matchesSearch(searchValue, [v.title, v.author, v.category, v.dateLabel]),
  );
}

export default function PurchasedContent() {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");

  const filteredCollections = useMemo(
    () =>
      MOCK_PURCHASED_COLLECTIONS.filter((c) =>
        matchesSearch(searchValue, [c.title, c.author, String(c.elementCount)]),
      ),
    [searchValue],
  );

  const filteredVideos = useMemo(
    () => filterMedia(searchValue, MOCK_PURCHASED_VIDEOS),
    [searchValue],
  );

  const filteredAudios = useMemo(
    () => filterMedia(searchValue, MOCK_PURCHASED_AUDIOS),
    [searchValue],
  );

  const filteredPdfs = useMemo(
    () => filterMedia(searchValue, MOCK_PURCHASED_PDFS),
    [searchValue],
  );

  return (
    <PageWrap>
      <PageHeader>
        <MonoText $use="H4_SemiBold" as="h1">
          {t(DASHBOARD_VIEWER_PURCHASED.title)}
        </MonoText>
        <SearchIcon />
      </PageHeader>

      <CollectionsSection items={filteredCollections} />
      <VideosSection items={filteredVideos} />
      <AudiosSection items={filteredAudios} />
      <PdfSection items={filteredPdfs} />
    </PageWrap>
  );
}
