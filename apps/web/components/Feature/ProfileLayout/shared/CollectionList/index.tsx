"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useQueries } from "@tanstack/react-query";
import CollectionsSection from "@/components/Feature/Dashboard/ViewerSections/CollectionsSection";
import GenericSpinner from "@/components/UI/GenericSpinner";
import {
  CollectionsApiResponse,
  getCollectionRows,
} from "@/hooks/contents/collectionApi";
import { useCreatorChannelProfile } from "@/hooks/useCreatorChannelProfile";
import { useCreatorProfileUi } from "@/hooks/useCreatorChannelLayout";
import { matchesProfileSearch } from "@/utils/creatorChannel";
import { API } from "@/lib/http/api/endpoints";
import { useGetAPI } from "@/lib/http/api/getApi";
import { axiosClient } from "@/lib/http/axiosClient";
import {
  CREATOR,
  HASH_RENT,
  HASH_BUY,
  STRING_EMPTY,
  resolveImageUrl,
  VARIANT_PAGE,
} from "@/utils/Constants";
import AccessGate from "@/components/Feature/AccessGate";
import { useCreatorAccessGate } from "@/hooks/useCreatorAccessGate";
import { resolvePublicMediaUrl } from "@/utils/media";
import { tutorialVideoCardFallback } from "@/utils/data";
import {
  RENTED_MODES,
  type CollectionAction,
  type RentedCollectionItem,
} from "@/utils/viewerRented";
import { CollectionListInner, CollectionListShell } from "./styles";
import { ProfileLoadingWrapper } from "@/components/Feature/ProfileLayout/pageStyles";
import { pathPublicCollection } from "@/utils/path";
import { VARIANT } from "@/utils/variants";
import {
  getContentPricingActions,
  getPricingLabels,
  isRentActionLabel,
  isBuyActionLabel,
} from "@/utils/contentPricingActions";
import ProfileEmptyState from "@/components/Feature/ProfileLayout/shared/ProfileEmptyState";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import { useViewerPurchased } from "@/hooks/viewer/useViewerPurchased";
import { useViewerRentedData } from "@/hooks/useViewerRented";

type PublicCollectionResponse = {
  data?: {
    items?: unknown[];
  } | null;
};

export default function CollectionList() {
  const { t } = useTranslation();
  const { searchQuery } = useCreatorProfileUi();
  const { displayName, isPublicView, publicCreatorId, isLoadingProfile } =
    useCreatorChannelProfile();
  const router = useRouter();
  const user = useStoredLoginUser();

  const { gateType, handleSuccess } = useCreatorAccessGate();

  const { data: collectionsResponse, isLoading: isCollectionsLoading } =
    useGetAPI<CollectionsApiResponse>(
      isPublicView && publicCreatorId
        ? API.collection.getPublicByCreator(publicCreatorId)
        : API.collection.getAll,
      undefined,
      {
        enabled: !gateType && (!isPublicView || Boolean(publicCreatorId)),
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

  const publicContentQueries = useQueries({
    queries: nonEmptyCollections.map((collection) => ({
      queryKey: [API.content.publicCollection(collection.id)],
      queryFn: async () => {
        const response = await axiosClient.get<PublicCollectionResponse>(
          API.content.publicCollection(collection.id),
        );
        return response.data;
      },
      retry: false,
      refetchOnWindowFocus: false,
    })),
  });

  const collectionsWithPublicContent = useMemo(
    () =>
      nonEmptyCollections.flatMap((collection, index) => {
        const publicItems = publicContentQueries[index]?.data?.data?.items;
        if (!publicItems?.length) return [];

        return [{ ...collection, contentsCount: publicItems.length }];
      }),
    [nonEmptyCollections, publicContentQueries],
  );

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

  const isLoggedIn = Boolean(user?.id);
  const { data: purchasedData } = useViewerPurchased(isLoggedIn);
  const { sources: rentedData } = useViewerRentedData(
    RENTED_MODES.CURRENTLY,
    isLoggedIn,
  );

  const accessibleCollectionIds = useMemo(() => {
    const collectionIdSet = new Set<string>();
    purchasedData?.collections?.forEach((collectionItem) =>
      collectionIdSet.add(collectionItem.id),
    );
    rentedData?.collections?.forEach((collectionItem) =>
      collectionIdSet.add(collectionItem.id),
    );
    return collectionIdSet;
  }, [purchasedData, rentedData]);

  const items = useMemo<RentedCollectionItem[]>(() => {
    const rows = collectionsWithPublicContent;

    return rows.map((row) => {
      const collectionHref = pathPublicCollection(row.id);

      let actions: CollectionAction[] | undefined = undefined;

      const hasCollectionAccess = accessibleCollectionIds.has(row.id);

      if (isPublicView && !hasCollectionAccess) {
        const pricingActions = getContentPricingActions(
          {
            accessType: row.accessType,
            buyPrice: row.buyPrice,
            rentPrice: row.rentPrice,
          },
          t("pricingLabels.free"),
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
          ? resolvePublicMediaUrl(row.coverImageUrl) ||
            resolveImageUrl(tutorialVideoCardFallback.image)
          : resolveImageUrl(tutorialVideoCardFallback.image),
        hideBadge: true,
        href: collectionHref,
        actions,
      };
    });
  }, [
    isPublicView,
    collectionsWithPublicContent,
    displayName,
    t,
    accessibleCollectionIds,
  ]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    return items.filter((item) =>
      matchesProfileSearch(searchQuery, item.title),
    );
  }, [items, searchQuery]);

  const isLoading =
    isLoadingProfile ||
    isCollectionsLoading ||
    publicContentQueries.some((query) => query.isLoading);

  if (gateType) {
    return (
      <AccessGate
        type={gateType}
        variant={VARIANT_PAGE}
        creatorName={displayName ?? undefined}
        onSuccess={handleSuccess}
      />
    );
  }

  return (
    <CollectionListShell data-creator-collection>
      <CollectionListInner>
        {isLoading ? (
          <ProfileLoadingWrapper>
            <GenericSpinner size={48} />
          </ProfileLoadingWrapper>
        ) : filteredItems.length === 0 ? (
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
