"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import CollectionsSection from "@/components/Feature/Dashboard/ViewerSections/CollectionsSection";
import {
  CollectionsApiResponse,
  getCollectionRows,
} from "@/hooks/contents/collectionApi";
import { useCreatorChannelProfile } from "@/hooks/useCreatorChannelProfile";
import { API } from "@/lib/http/api/endpoints";
import { useGetAPI } from "@/lib/http/api/getApi";
import { resolveImageUrl } from "@/utils/Constants";
import { tutorialVideos } from "@/utils/data";
import type { RentedCollectionItem } from "@/utils/dummyData/viewerRentedMockData";
import { RENTED_MODES } from "@/utils/viewerRented";
import { CollectionListInner, CollectionListShell } from "./styles";

export default function CollectionList() {
  const { t } = useTranslation();
  const { displayName } = useCreatorChannelProfile();
  const { data: collectionsResponse } = useGetAPI<CollectionsApiResponse>(
    API.collection.getAll,
  );

  const items = useMemo<RentedCollectionItem[]>(() => {
    if (!collectionsResponse) return [];

    const rows = getCollectionRows(collectionsResponse);

    return rows.map((row, index) => ({
      id: row.id,
      title: row.name,
      author: displayName || "Creator",
      elementCount: row.contentsCount,
      coverSrc: resolveImageUrl(
        tutorialVideos[index % tutorialVideos.length]?.image ?? "",
      ),
      hideBadge: true,
      actions: [
        {
          label: t("createProfileAbout.buy"),
          variant: "primary",
        },
      ],
    }));
  }, [collectionsResponse, displayName, t]);

  return (
    <CollectionListShell>
      <CollectionListInner>
        <CollectionsSection
          mode={RENTED_MODES.PURCHASED}
          items={items}
          totalItems={items.length}
          canSlide={() => false}
          canGoPrev={() => false}
          canGoNext={() => false}
          movePrev={() => {}}
          moveNext={() => {}}
        />
      </CollectionListInner>
    </CollectionListShell>
  );
}
