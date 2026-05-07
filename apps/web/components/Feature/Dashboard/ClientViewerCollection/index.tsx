"use client";

import { useTranslation } from "react-i18next";
import PurchasedCollectionCard from "../ClientViewerPurchased/PurchasedCollectionCard";
import { DASHBOARD_VIEWER_PURCHASED } from "@/utils/translationKeys";

import {
  CollectionCardSlot,
  CollectionsGrid,
  PageHeader,
  PageInner,
  PageShell,
  PageTitle,
} from "./styles";
import { COLLECTIONS_FOR_PAGE } from "@/utils/dummyData/collectionData";

export default function ClientViewerCollection() {
  const { t } = useTranslation();

  return (
    <PageShell>
      <PageInner>
        <PageHeader>
          <PageTitle>
            {t(DASHBOARD_VIEWER_PURCHASED.sections.collections)}
          </PageTitle>
        </PageHeader>

        <CollectionsGrid>
          {COLLECTIONS_FOR_PAGE.map((item) => (
            <CollectionCardSlot key={item.id}>
              <PurchasedCollectionCard item={item} />
            </CollectionCardSlot>
          ))}
        </CollectionsGrid>
      </PageInner>
    </PageShell>
  );
}
