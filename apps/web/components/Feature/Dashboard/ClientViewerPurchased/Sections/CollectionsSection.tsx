"use client";

import PurchasedCollectionCard from "../PurchasedCollectionCard";
import type { PurchasedCollectionItem } from "@/utils/dummyData/viewerPurchasedMockData";
import { VIEWER_PURCHASED_PLACEHOLDERS } from "@/utils/dummyData/viewerPurchasedMockData";
import {
  CollectionCardSlot,
  CollectionsList,
  EmptyHint,
  SectionBlock,
  SectionHeaderRow,
  SectionTitle,
} from "../styles";
import { LeftIcon } from "@/assets/icons";

type Props = {
  items: PurchasedCollectionItem[];
};

export default function CollectionsSection({ items }: Props) {
  return (
    <SectionBlock>
      <SectionHeaderRow>
        <SectionTitle>Collections</SectionTitle>
        <LeftIcon />
      </SectionHeaderRow>
      {items.length === 0 ? (
        <EmptyHint>{VIEWER_PURCHASED_PLACEHOLDERS.emptyCollections}</EmptyHint>
      ) : (
        <CollectionsList>
          {items.map((item) => (
            <CollectionCardSlot key={item.id}>
              <PurchasedCollectionCard item={item} />
            </CollectionCardSlot>
          ))}
        </CollectionsList>
      )}
    </SectionBlock>
  );
}
