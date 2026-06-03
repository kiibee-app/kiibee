"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import LeftIcon from "@/assets/icons/LeftIcon";
import { MonoText } from "@/components/UI/Monotext";
import type {
  RentedMediaItem,
  RentedMode,
} from "@/utils/dummyData/viewerRentedMockData";
import type { PurchasedCollectionItem } from "@/utils/dummyData/viewerPurchasedMockData";
import {
  SingleContentBody,
  SingleContentHero,
} from "@/components/Feature/SingleContentPage/ContentSections";
import { SCROLL_TO_START_OPTIONS } from "@/utils/Constants";
import {
  getPurchasedMediaDetailView,
  purchasedMediaToTutorial,
  rentedMediaToPurchasedItem,
} from "@/utils/purchasedMediaToTutorial";
import CollectionContent from "@/components/Feature/SingleCollectionHero/CollectionContent";
import { getCollectionBadgeText } from "@/utils/viewerRented";
import { HeaderBackButton, HeaderTitleWrap, PageHeader } from "./styles";
import {
  DetailBodyWrap,
  DetailHeroWrap,
  DetailTopWrap,
  EmptyStateWrap,
} from "./purchasedCollectionDetail.styles";

type Props = {
  collection: PurchasedCollectionItem | undefined;
  mediaItems: RentedMediaItem[];
  onBack: () => void;
  initialSelectedMediaId?: string | null;
  onSelectMedia?: (mediaId: string) => void;
  title: string;
  mode: RentedMode;
};

export default function PurchasedCollectionDetail({
  collection,
  mediaItems,
  onBack,
  initialSelectedMediaId = null,
  onSelectMedia,
  title,
  mode,
}: Props) {
  const { t } = useTranslation();
  const detailAnchorRef = useRef<HTMLDivElement>(null);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(
    initialSelectedMediaId,
  );
  const statusLabel = getCollectionBadgeText(mode);

  const purchasedItems = useMemo(
    () => mediaItems.map(rentedMediaToPurchasedItem),
    [mediaItems],
  );

  const tutorials = useMemo(
    () => purchasedItems.map((item) => purchasedMediaToTutorial(item)),
    [purchasedItems],
  );

  const selectedMedia = useMemo(
    () => purchasedItems.find((item) => item.id === selectedMediaId),
    [purchasedItems, selectedMediaId],
  );

  const itemDetailView = useMemo(() => {
    if (!collection || !selectedMedia) return null;
    const detailView = getPurchasedMediaDetailView(
      selectedMedia,
      collection,
      t,
    );

    return {
      ...detailView,
      body: {
        ...detailView.body,
        statusLabel,
      },
    };
  }, [collection, selectedMedia, statusLabel, t]);

  useEffect(() => {
    setSelectedMediaId(initialSelectedMediaId);
  }, [initialSelectedMediaId]);

  useEffect(() => {
    if (!selectedMediaId) return;
    detailAnchorRef.current?.scrollIntoView(SCROLL_TO_START_OPTIONS);
  }, [selectedMediaId]);

  if (!collection) {
    return (
      <EmptyStateWrap>
        <MonoText $use="Body_Medium">Collection not found.</MonoText>
      </EmptyStateWrap>
    );
  }

  return (
    <>
      <DetailTopWrap ref={detailAnchorRef}>
        <PageHeader>
          <HeaderTitleWrap>
            <HeaderBackButton
              type="button"
              aria-label={t("common.back")}
              onClick={onBack}
            >
              <LeftIcon style={{ transform: "rotate(180deg)" }} />
            </HeaderBackButton>
            <MonoText $use="H4_SemiBold">{title}</MonoText>
          </HeaderTitleWrap>
        </PageHeader>

        {itemDetailView ? (
          <>
            <DetailHeroWrap>
              <SingleContentHero hero={itemDetailView.hero} />
            </DetailHeroWrap>
            <DetailBodyWrap>
              <SingleContentBody {...itemDetailView.body} />
            </DetailBodyWrap>
          </>
        ) : (
          <>
            <DetailHeroWrap>
              <SingleContentHero
                hero={{
                  image: collection.coverSrc,
                  imageAlt: collection.title,
                  categoryLabel: statusLabel,
                }}
              />
            </DetailHeroWrap>
            <DetailBodyWrap>
              <SingleContentBody
                creator={{ name: collection.author }}
                statusLabel={statusLabel}
                title={collection.title}
                descriptions={collection.descriptionLines}
                primaryAction={{
                  label: statusLabel,
                  disabled: true,
                }}
                metaItems={[
                  {
                    label: "Access",
                    value: collection.accessPeriodLabel ?? "Lifetime access",
                  },
                ]}
              />
            </DetailBodyWrap>
          </>
        )}
      </DetailTopWrap>

      <CollectionContent
        videos={tutorials}
        embedded
        selectedVideoId={selectedMediaId}
        onSelectVideo={(mediaId) => {
          setSelectedMediaId(mediaId);
          onSelectMedia?.(mediaId);
        }}
      />
    </>
  );
}
