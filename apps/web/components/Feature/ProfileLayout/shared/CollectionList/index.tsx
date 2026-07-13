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
import { CREATOR, resolveImageUrl } from "@/utils/Constants";
import { tutorialVideoCardFallback } from "@/utils/data";
import {
  RENTED_MODES,
  type CollectionAction,
  type RentedCollectionItem,
} from "@/utils/viewerRented";
import { CollectionListInner, CollectionListShell } from "./styles";
import { authStorage } from "@/lib/auth/authStorage";
import { PATHS, pathPublishedContent } from "@/utils/path";
import { QUERY_KEYS } from "@/utils/Constants";
import { VARIANT } from "@/utils/variants";
import {
  getContentPricingActions,
  getPricingLabels,
  isRentActionLabel,
  isBuyActionLabel,
} from "@/utils/contentPricingActions";
import ProfileEmptyState from "@/components/Feature/ProfileLayout/shared/ProfileEmptyState";

export default function CollectionList() {
  const { t } = useTranslation();
  const { searchQuery } = useCreatorProfileUi();
  const { displayName, isPublicView, publicCreatorId } =
    useCreatorChannelProfile();
  const router = useRouter();

  const { data: collectionsResponse, isLoading: isCollectionsLoading } =
    useGetAPI<CollectionsApiResponse>(
      isPublicView && publicCreatorId
        ? API.collection.getPublicByCreator(publicCreatorId)
        : API.collection.getAll,
      undefined,
      {
        enabled: !isPublicView || Boolean(publicCreatorId),
        retry: false,
        refetchOnWindowFocus: false,
      },
    );

  const { data: collectionContentsMap } = useQuery<Record<string, string>>({
    queryKey: [
      QUERY_KEYS.PROFILE_HOME_COLLECTIONS_PREVIEW,
      "contents",
      isPublicView,
      publicCreatorId,
    ],
    queryFn: async () => {
      if (!collectionsResponse) return {};
      const collections = getCollectionRows(collectionsResponse);
      if (!collections.length) return {};

      const contentsResponses = await Promise.all(
        collections.map((item) =>
          axiosClient.get<CollectionContentsApiResponse>(
            isPublicView
              ? API.content.publicCollection(item.id)
              : API.content.collection(item.id),
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
    enabled: Boolean(collectionsResponse),
    refetchOnWindowFocus: false,
  });

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
    if (!collectionsResponse) return [];
    const rows = getCollectionRows(collectionsResponse);

    return rows.map((row) => {
      const firstContentId = collectionContentsMap?.[row.id];
      const contentHref = firstContentId
        ? pathPublishedContent(firstContentId)
        : `/single-collection?id=${row.id}`;

      let actions: CollectionAction[] | undefined = undefined;

      if (isPublicView) {
        const pricingActions = getContentPricingActions(
          {
            accessType: row.accessType,
            buyPrice: row.buyPrice,
            rentPrice: row.rentPrice,
          },
          t("createProfileHome.latestUpload.seeContent"),
          { labels: getPricingLabels(t) },
        );

        actions = pricingActions.map((action) => {
          let href = `/single-collection?id=${row.id}`;
          if (action.label && isRentActionLabel(action.label)) {
            href = `${href}#rent`;
          } else if (action.label && isBuyActionLabel(action.label)) {
            href = `${href}#buy`;
          } else {
            href = contentHref;
          }

          return {
            label: action.label,
            variant:
              isRentActionLabel(action.label) || isBuyActionLabel(action.label)
                ? VARIANT.PRIMARY
                : VARIANT.SECONDARY,
            href,
          };
        });
      } else {
        actions = [
          {
            label: t("createProfileHome.latestUpload.seeContent"),
            variant: VARIANT.SECONDARY,
            href: contentHref,
          },
        ];
      }

      return {
        id: row.id,
        title: row.name,
        author: displayName || CREATOR,
        elementCount: row.contentsCount,
        coverSrc: row.coverImageUrl
          ? resolveImageUrl(row.coverImageUrl)
          : resolveImageUrl(tutorialVideoCardFallback.image),
        hideBadge: true,
        href: contentHref,
        actions,
      };
    });
  }, [
    isPublicView,
    collectionsResponse,
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

  const isLoading = isCollectionsLoading;

  return (
    <CollectionListShell>
      <CollectionListInner>
        {filteredItems.length === 0 && !isLoading ? (
          <ProfileEmptyState
            title={
              searchQuery.trim() !== ""
                ? t("createProfileHome.noSearchResultsTitle")
                : t("createProfileHome.noContentTitle")
            }
            description={
              searchQuery.trim() !== ""
                ? t("createProfileHome.noSearchResultsDescription")
                : t("createProfileHome.noContentDescription")
            }
          />
        ) : (
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
        )}
      </CollectionListInner>
    </CollectionListShell>
  );
}
