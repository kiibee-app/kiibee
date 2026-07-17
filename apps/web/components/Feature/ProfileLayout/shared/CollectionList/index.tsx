"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
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
import {
  CREATOR,
  HASH_RENT,
  HASH_BUY,
  STRING_EMPTY,
  resolveImageUrl,
} from "@/utils/Constants";
import { tutorialVideoCardFallback } from "@/utils/data";
import {
  RENTED_MODES,
  type CollectionAction,
  type RentedCollectionItem,
} from "@/utils/viewerRented";
import { CollectionListInner, CollectionListShell } from "./styles";
import { pathPublicCollection } from "@/utils/path";
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

  const nonEmptyCollections = useMemo(() => {
    if (!collectionsResponse) return [];
    return getCollectionRows(collectionsResponse).filter(
      (row) => row.contentsCount > 0,
    );
  }, [collectionsResponse]);

  const handleBuyClick = useCallback(
    (item: RentedCollectionItem) => {
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
    const rows = nonEmptyCollections;

    return rows.map((row) => {
      const collectionHref = pathPublicCollection(row.id);

      let actions: CollectionAction[] | undefined = undefined;

      if (isPublicView) {
        const pricingActions = getContentPricingActions(
          {
            accessType: row.accessType,
            buyPrice: row.buyPrice,
            rentPrice: row.rentPrice,
          },
          t("createProfileHome.latestUpload.seeContent"),
          { inCollection: true, labels: getPricingLabels(t) },
        );

        actions = pricingActions.map((action) => {
          const label = action.label ?? STRING_EMPTY;
          const hash = isRentActionLabel(label)
            ? HASH_RENT
            : isBuyActionLabel(label)
              ? HASH_BUY
              : STRING_EMPTY;

          return {
            label,
            variant: hash ? VARIANT.PRIMARY : VARIANT.SECONDARY,
            href: collectionHref,
          };
        });
      } else {
        actions = [
          {
            label: t("createProfileHome.latestUpload.seeContent"),
            variant: VARIANT.SECONDARY,
            href: collectionHref,
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
        href: collectionHref,
        actions,
      };
    });
  }, [isPublicView, nonEmptyCollections, displayName, t]);

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
