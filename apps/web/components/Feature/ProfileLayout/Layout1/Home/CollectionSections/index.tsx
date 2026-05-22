"use client";

import { LAYOUT1_COLLECTION_SECTIONS } from "@/utils/dummyData/collectionData";
import { SectionsWrap } from "./styles";
import CollectionSection from "./collectionSection";

export default function CollectionSections() {
  return (
    <SectionsWrap>
      {LAYOUT1_COLLECTION_SECTIONS.map((section) => (
        <CollectionSection key={section.id} section={section} />
      ))}
    </SectionsWrap>
  );
}
