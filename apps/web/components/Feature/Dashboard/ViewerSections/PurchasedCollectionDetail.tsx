"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import LeftIcon from "@/assets/icons/LeftIcon";
import { MonoText } from "@/components/UI/Monotext";
import type { RentedMediaItem } from "@/utils/dummyData/viewerRentedMockData";
import type {
  PurchasedCollectionItem,
  PurchasedMediaType,
} from "@/utils/dummyData/viewerPurchasedMockData";
import {
  SingleContentBody,
  SingleContentHero,
} from "@/components/Feature/SingleContentPage/ContentSections";
import { purchasedMediaToTutorial } from "@/utils/purchasedMediaToTutorial";
import CollectionContent from "@/components/Feature/SingleCollectionHero/CollectionContent";
import { VIEWER_LABELS } from "@/utils/SidebarItems";
import { HeaderBackButton, HeaderTitleWrap, PageHeader } from "./styles";
import {
  DetailBodyWrap,
  DetailTopWrap,
  EmptyStateWrap,
} from "./purchasedCollectionDetail.styles";

type Props = {
  collection: PurchasedCollectionItem | undefined;
  mediaItems: RentedMediaItem[];
  onBack: () => void;
};

function toPurchasedMediaType(
  type: RentedMediaItem["mediaType"],
): PurchasedMediaType {
  return type as PurchasedMediaType;
}

export default function PurchasedCollectionDetail({
  collection,
  mediaItems,
  onBack,
}: Props) {
  const { t } = useTranslation();
  const tutorials = useMemo(
    () =>
      mediaItems.map((item) =>
        purchasedMediaToTutorial({
          id: item.id,
          mediaType: toPurchasedMediaType(item.mediaType),
          category: item.category,
          thumbSrc: item.thumbSrc,
          title: item.title,
          author: item.author,
          dateLabel: item.expiryText,
        }),
      ),
    [mediaItems],
  );

  if (!collection) {
    return (
      <EmptyStateWrap>
        <MonoText $use="Body_Medium">Collection not found.</MonoText>
      </EmptyStateWrap>
    );
  }

  return (
    <>
      <DetailTopWrap>
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
      </DetailTopWrap>

      <SingleContentHero
        hero={{
          image: collection.coverSrc,
          imageAlt: collection.title,
          categoryLabel: "Owned",
        }}
      />

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

      <CollectionContent videos={tutorials} />
    </>
  );
}
