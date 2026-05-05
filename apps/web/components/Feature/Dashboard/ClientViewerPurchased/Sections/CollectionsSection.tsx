"use client";

import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";
import PurchasedCollectionCard from "../PurchasedCollectionCard";
import type { PurchasedCollectionItem } from "@/utils/dummyData/viewerPurchasedMockData";
import {
  CollectionCardSlot,
  CollectionsList,
  EmptyHint,
  SectionBlock,
  SectionHeaderRow,
  SectionTitle,
} from "../styles";
import { LeftIcon } from "@/assets/icons";
import { DASHBOARD_VIEWER_PURCHASED } from "@/utils/translationKeys";

type Props = {
  items: PurchasedCollectionItem[];
  title?: string;
  emptyHint?: string;
  CardComponent?: ComponentType<{ item: PurchasedCollectionItem }>;
};

export default function CollectionsSection({
  items,
  title,
  emptyHint,
  CardComponent = PurchasedCollectionCard,
}: Props) {
  const { t } = useTranslation();
  const sectionTitle =
    title ?? t(DASHBOARD_VIEWER_PURCHASED.sections.collections);
  const emptyCopy =
    emptyHint ?? t(DASHBOARD_VIEWER_PURCHASED.emptyStates.collections);

  return (
    <SectionBlock>
      <SectionHeaderRow>
        <SectionTitle>{sectionTitle}</SectionTitle>
        <LeftIcon />
      </SectionHeaderRow>
      {items.length === 0 ? (
        <EmptyHint>{emptyCopy}</EmptyHint>
      ) : (
        <CollectionsList>
          {items.map((item) => (
            <CollectionCardSlot key={item.id}>
              <CardComponent item={item} />
            </CollectionCardSlot>
          ))}
        </CollectionsList>
      )}
    </SectionBlock>
  );
}
