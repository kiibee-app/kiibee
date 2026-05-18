"use client";

import CollectionsSection from "@/components/Feature/Dashboard/ViewerSections/CollectionsSection";
import { COLLECTIONS_FOR_PAGE } from "@/utils/dummyData/collectionData";
import { RENTED_MODES } from "@/utils/viewerRented";
import { CollectionListShell } from "./styles";

export default function CollectionList() {
  return (
    <CollectionListShell>
      <CollectionsSection
        mode={RENTED_MODES.PURCHASED}
        items={COLLECTIONS_FOR_PAGE}
        totalItems={COLLECTIONS_FOR_PAGE.length}
        canSlide={() => false}
        canGoPrev={() => false}
        canGoNext={() => false}
        movePrev={() => {}}
        moveNext={() => {}}
      />
    </CollectionListShell>
  );
}
