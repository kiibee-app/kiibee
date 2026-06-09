"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import CollectionsSection from "@/components/Feature/Dashboard/ViewerSections/CollectionsSection";
import {
  CollectionsApiResponse,
  getCollectionRows,
} from "@/hooks/contents/collectionApi";
import { useCreatorChannelProfile } from "@/hooks/useCreatorChannelProfile";
import { useCreatorProfileUi } from "@/hooks/useCreatorChannelLayout";
import { matchesProfileSearch } from "@/utils/creatorChannel";
import { API } from "@/lib/http/api/endpoints";
import { useGetAPI } from "@/lib/http/api/getApi";
import { resolveImageUrl } from "@/utils/Constants";
import { tutorialVideos } from "@/utils/data";
import type { RentedCollectionItem } from "@/utils/dummyData/viewerRentedMockData";
import { RENTED_MODES } from "@/utils/viewerRented";
import { CollectionListInner, CollectionListShell } from "./styles";
import { authStorage } from "@/lib/auth/authStorage";
import { PATHS } from "@/utils/path";

import { usePublicCreatorContent } from "@/hooks/creators/usePublicCreatorContent";

export default function CollectionList() {
  const { searchQuery } = useCreatorProfileUi();
  const { displayName, isPublicView, publicCreatorId } =
    useCreatorChannelProfile();
  const router = useRouter();

  const { data: privateCollectionsResponse } =
    useGetAPI<CollectionsApiResponse>(API.collection.getAll, undefined, {
      enabled: !isPublicView,
    });

  const { tutorials: publicTutorials } = usePublicCreatorContent(
    isPublicView ? publicCreatorId : null,
  );

  const handleBuyClick = useCallback(() => {
    if (authStorage.hasSession()) return;
    const next = encodeURIComponent(
      window.location.pathname + window.location.search,
    );
    router.push(`${PATHS.AUTH_LOGIN}?next=${next}`);
  }, [router]);

  const items = useMemo<RentedCollectionItem[]>(() => {
    if (isPublicView) {
      const groups: Record<
        string,
        { title: string; count: number; coverSrc: string }
      > = {};

      publicTutorials.forEach((tutorial) => {
        const cat = tutorial.category || "Content";
        if (!groups[cat]) {
          groups[cat] = {
            title: cat,
            count: 0,
            coverSrc: resolveImageUrl(tutorial.image),
          };
        }
        groups[cat].count += 1;
      });

      return Object.entries(groups).map(([id, group]) => ({
        id,
        title: group.title,
        author: displayName || "Creator",
        elementCount: group.count,
        coverSrc: group.coverSrc,
        hideBadge: true,
      }));
    }

    if (!privateCollectionsResponse) return [];
    const rows = getCollectionRows(privateCollectionsResponse);

    return rows.map((row, index) => ({
      id: row.id,
      title: row.name,
      author: displayName || "Creator",
      elementCount: row.contentsCount,
      coverSrc: resolveImageUrl(
        tutorialVideos[index % tutorialVideos.length]?.image ?? "",
      ),
      hideBadge: true,
    }));
  }, [isPublicView, publicTutorials, privateCollectionsResponse, displayName]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    return items.filter((item) =>
      matchesProfileSearch(searchQuery, item.title),
    );
  }, [items, searchQuery]);

  return (
    <CollectionListShell>
      <CollectionListInner>
        <CollectionsSection
          mode={RENTED_MODES.PURCHASED}
          items={filteredItems}
          totalItems={filteredItems.length}
          canSlide={() => false}
          canGoPrev={() => false}
          canGoNext={() => false}
          movePrev={() => {}}
          moveNext={() => {}}
          onCollectionPrimaryAction={handleBuyClick}
        />
      </CollectionListInner>
    </CollectionListShell>
  );
}
