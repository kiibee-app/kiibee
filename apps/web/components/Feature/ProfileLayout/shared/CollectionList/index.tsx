"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import CollectionsSection from "@/components/Feature/Dashboard/ViewerSections/CollectionsSection";
import {
  CollectionsApiResponse,
  CollectionContentsApiResponse,
  getCollectionRows,
  getCollectionContentRows,
} from "@/hooks/contents/collectionApi";
import { useCreatorChannelProfile } from "@/hooks/useCreatorChannelProfile";
import { useCreatorProfileUi } from "@/hooks/useCreatorChannelLayout";
import { matchesProfileSearch } from "@/utils/creatorChannel";
import { API } from "@/lib/http/api/endpoints";
import { axiosClient } from "@/lib/http/axiosClient";
import { useGetAPI } from "@/lib/http/api/getApi";
import { resolveImageUrl, VARIANT } from "@/utils/Constants";
import { tutorialVideos } from "@/utils/data";
import type { RentedCollectionItem } from "@/utils/dummyData/viewerRentedMockData";
import { RENTED_MODES } from "@/utils/viewerRented";
import { CollectionListInner, CollectionListShell } from "./styles";
import { authStorage } from "@/lib/auth/authStorage";
import { PATHS, pathPublishedContent } from "@/utils/path";
import {
  getContentPricingActions,
  isFreeContentItem,
  resolveContentActionHref,
} from "@/utils/contentPricingActions";
import { QUERY_KEYS } from "@/utils/Constants";
import { usePublicCreatorContent } from "@/hooks/creators/usePublicCreatorContent";

export default function CollectionList() {
  const { t } = useTranslation();
  const { searchQuery } = useCreatorProfileUi();
  const { displayName, isPublicView, publicCreatorId } =
    useCreatorChannelProfile();
  const router = useRouter();

  const { data: privateCollectionsResponse } =
    useGetAPI<CollectionsApiResponse>(API.collection.getAll, undefined, {
      enabled: !isPublicView,
    });

  const { data: collectionContentsMap } = useQuery<Record<string, string>>({
    queryKey: [QUERY_KEYS.PROFILE_HOME_COLLECTIONS_PREVIEW, "contents"],
    queryFn: async () => {
      if (!privateCollectionsResponse) return {};
      const collections = getCollectionRows(privateCollectionsResponse);
      if (!collections.length) return {};

      const contentsResponses = await Promise.all(
        collections.map((item) =>
          axiosClient.get<CollectionContentsApiResponse>(
            API.content.collection(item.id),
          ),
        ),
      );

      const map: Record<string, string> = {};
      collections.forEach((collection, index) => {
        const contentRows = getCollectionContentRows(
          contentsResponses[index]?.data,
        );
        if (contentRows.length > 0) {
          map[collection.id] = contentRows[0].id;
        }
      });
      return map;
    },
    enabled: Boolean(privateCollectionsResponse),
    refetchOnWindowFocus: false,
  });

  const { tutorials: publicTutorials } = usePublicCreatorContent(
    isPublicView ? publicCreatorId : null,
  );

  const handleBuyClick = useCallback(
    (item: RentedCollectionItem) => {
      if (!authStorage.hasSession()) {
        const next = encodeURIComponent(
          window.location.pathname + window.location.search,
        );
        router.push(`${PATHS.AUTH_LOGIN}?next=${next}`);
        return;
      }
      if (item.href) {
        router.push(item.href);
      }
    },
    [router],
  );

  const handleCardClick = useCallback(
    (item: RentedCollectionItem) => {
      if (item.href) {
        router.push(item.href);
      }
    },
    [router],
  );

  const items = useMemo<RentedCollectionItem[]>(() => {
    if (isPublicView) {
      const groups: Record<
        string,
        {
          title: string;
          count: number;
          coverSrc: string;
          firstContentId?: string;
        }
      > = {};

      publicTutorials.forEach((tutorial) => {
        const cat = tutorial.category || "Content";
        if (!groups[cat]) {
          groups[cat] = {
            title: cat,
            count: 0,
            coverSrc: resolveImageUrl(tutorial.image),
            firstContentId: tutorial.id,
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
        href: group.firstContentId
          ? pathPublishedContent(group.firstContentId)
          : `/single-collection?id=${id}`,
      }));
    }

    if (!privateCollectionsResponse) return [];
    const rows = getCollectionRows(privateCollectionsResponse);

    return rows.map((row, index) => {
      const firstContentId = collectionContentsMap?.[row.id];
      const contentHref = firstContentId
        ? pathPublishedContent(firstContentId)
        : `/single-collection?id=${row.id}`;

      const pricingItem = {
        accessType: row.accessType,
        buyPrice: row.buyPrice,
        rentPrice: row.rentPrice,
      };

      const pricingActions = getContentPricingActions(
        pricingItem,
        t("createProfileHome.latestUpload.seeContent"),
        {
          inCollection: true,
        },
      );

      const isFree = isFreeContentItem(pricingItem);

      const actions = pricingActions.map((action) => ({
        label: action.label,
        variant: isFree ? VARIANT.SECONDARY : VARIANT.PRIMARY,
        href: firstContentId
          ? resolveContentActionHref(
              firstContentId,
              action.label,
              pricingItem,
              pricingActions.length,
              { inCollection: true },
            )
          : contentHref,
      }));

      return {
        id: row.id,
        title: row.name,
        author: displayName,
        elementCount: row.contentsCount,
        coverSrc: resolveImageUrl(
          tutorialVideos[index % tutorialVideos.length]?.image ?? "",
        ),
        hideBadge: true,
        href: contentHref,
        actions: actions.length > 0 ? actions : undefined,
      };
    });
  }, [
    isPublicView,
    publicTutorials,
    privateCollectionsResponse,
    collectionContentsMap,
    displayName,
    t,
  ]);

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
          onCollectionClick={handleCardClick}
        />
      </CollectionListInner>
    </CollectionListShell>
  );
}
