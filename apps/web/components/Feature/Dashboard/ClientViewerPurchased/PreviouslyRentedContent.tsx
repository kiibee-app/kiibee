"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MonoText } from "@/components/UI/Monotext";
import {
  MOCK_PREVIOUSLY_RENTED_AUDIOS,
  MOCK_PREVIOUSLY_RENTED_COLLECTIONS,
  MOCK_PREVIOUSLY_RENTED_PDFS,
  MOCK_PREVIOUSLY_RENTED_VIDEOS,
  type PurchasedMediaItem,
} from "@/utils/dummyData/viewerPurchasedMockData";
import CollectionsSection from "./Sections/CollectionsSection";
import PreviouslyRentedCollectionCard from "./PreviouslyRentedCollectionCard";
import PurchasedMediaSection from "./PurchasedMediaSection";
import { PageHeader, PageWrap } from "./styles";
import { SearchIcon } from "@/assets/icons/searchBarIcon";
import { DASHBOARD_VIEWER_PREVIOUSLY_RENTED } from "@/utils/translationKeys";
import { purchasedMediaToTutorial } from "@/utils/purchasedMediaToTutorial";
import { VARIANT } from "@/utils/Constants";

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

export default function PreviouslyRentedContent() {
  const { t } = useTranslation();
  const [searchValue] = useState("");
  const getPreviouslyRentedTutorial = useCallback(
    (item: PurchasedMediaItem) => {
      const buyKr = item.buyPriceKr ?? 99;
      const rentKr = item.rentPriceKr ?? 29;
      const actionButtonStyle = { borderRadius: 16 };
      return purchasedMediaToTutorial(item, {
        published: t(DASHBOARD_VIEWER_PREVIOUSLY_RENTED.badges.expiredLine, {
          date: item.dateLabel,
        }),
        buttons: [
          {
            label: t(DASHBOARD_VIEWER_PREVIOUSLY_RENTED.buttons.buy, {
              price: buyKr,
            }),
            variant: VARIANT.PRIMARY,
            style: actionButtonStyle,
          },
          {
            label: t(DASHBOARD_VIEWER_PREVIOUSLY_RENTED.buttons.rent, {
              price: rentKr,
            }),
            variant: VARIANT.SECONDARY,
            style: actionButtonStyle,
          },
        ],
      });
    },
    [t],
  );

  const filteredCollections = useMemo(
    () =>
      MOCK_PREVIOUSLY_RENTED_COLLECTIONS.filter((c) =>
        matchesSearch(searchValue, [c.title, c.author, String(c.elementCount)]),
      ),
    [searchValue],
  );

  const filteredVideos = useMemo(
    () => filterMedia(searchValue, MOCK_PREVIOUSLY_RENTED_VIDEOS),
    [searchValue],
  );

  const filteredAudios = useMemo(
    () => filterMedia(searchValue, MOCK_PREVIOUSLY_RENTED_AUDIOS),
    [searchValue],
  );

  const filteredPdfs = useMemo(
    () => filterMedia(searchValue, MOCK_PREVIOUSLY_RENTED_PDFS),
    [searchValue],
  );

  return (
    <PageWrap>
      <PageHeader>
        <MonoText $use="H4_SemiBold">
          {t(DASHBOARD_VIEWER_PREVIOUSLY_RENTED.title)}
        </MonoText>
        <SearchIcon />
      </PageHeader>

      <CollectionsSection
        items={filteredCollections}
        title={t(DASHBOARD_VIEWER_PREVIOUSLY_RENTED.sections.collections)}
        emptyHint={t(
          DASHBOARD_VIEWER_PREVIOUSLY_RENTED.emptyStates.collections,
        )}
        CardComponent={PreviouslyRentedCollectionCard}
      />

      <PurchasedMediaSection
        title={t(DASHBOARD_VIEWER_PREVIOUSLY_RENTED.sections.videos)}
        items={filteredVideos}
        emptyHint={t(DASHBOARD_VIEWER_PREVIOUSLY_RENTED.emptyStates.media)}
        getTutorial={getPreviouslyRentedTutorial}
      />
      <PurchasedMediaSection
        title={t(DASHBOARD_VIEWER_PREVIOUSLY_RENTED.sections.audios)}
        items={filteredAudios}
        emptyHint={t(DASHBOARD_VIEWER_PREVIOUSLY_RENTED.emptyStates.media)}
        getTutorial={getPreviouslyRentedTutorial}
      />
      <PurchasedMediaSection
        title={t(DASHBOARD_VIEWER_PREVIOUSLY_RENTED.sections.pdf)}
        items={filteredPdfs}
        emptyHint={t(DASHBOARD_VIEWER_PREVIOUSLY_RENTED.emptyStates.media)}
        getTutorial={getPreviouslyRentedTutorial}
      />
    </PageWrap>
  );
}
