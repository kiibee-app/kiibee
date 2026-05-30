"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import LeftIcon from "@/assets/icons/LeftIcon";
import { MonoText } from "@/components/UI/Monotext";
import type { RentedMediaItem } from "@/utils/dummyData/viewerRentedMockData";
import type { PurchasedCollectionItem } from "@/utils/dummyData/viewerPurchasedMockData";
import {
  SingleContentBody,
  SingleContentHero,
} from "@/components/Feature/SingleContentPage/ContentSections";
import {
  getPurchasedMediaDetailView,
  purchasedMediaToTutorial,
  rentedMediaToPurchasedItem,
} from "@/utils/purchasedMediaToTutorial";
import CollectionContent from "@/components/Feature/SingleCollectionHero/CollectionContent";
import { VIEWER_LABELS } from "@/utils/SidebarItems";
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
};

export default function PurchasedCollectionDetail({
  collection,
  mediaItems,
  onBack,
}: Props) {
  const { t } = useTranslation();
  const detailAnchorRef = useRef<HTMLDivElement>(null);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);

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
    return getPurchasedMediaDetailView(selectedMedia, collection, t);
  }, [collection, selectedMedia, t]);

  useEffect(() => {
    if (!selectedMediaId) return;
    detailAnchorRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
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
            <MonoText $use="H4_SemiBold">{VIEWER_LABELS.PURCHASED}</MonoText>
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
                  categoryLabel: "Owned",
                }}
              />
            </DetailHeroWrap>
            <DetailBodyWrap>
              <SingleContentBody
                creator={{ name: collection.author }}
                statusLabel="Owned"
                title={collection.title}
                descriptions={collection.descriptionLines}
                primaryAction={{
                  label: "Purchased",
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
        onSelectVideo={setSelectedMediaId}
      />
    </>
  );
}
