"use client";

import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import {
  APPEARANCE,
  COLLECTIONS,
  CONTENT_TABS,
  COUPONS,
  ContentTab,
  SETTINGS,
} from "@/utils/common";
import { CONTENTS as CONTENTS_KEYS } from "@/utils/translationKeys";
import AppearanceContent from "./Appearance";
import AdmissionRequirements from "./AdmissionRequirements";
import CouponTable from "./coupon";
import { couponData } from "@/utils/dummyData/couponData";
import CollectionTable from "./Collections";
import { COLLECTION_TABLE_TYPE, CollectionTableType } from "@/utils/collection";
import { CollectionContentRow, CollectionRow } from "@/types/collectionsType";
import {
  EmptyCollectionCard,
  EmptyCollectionText,
  EmptyCollectionTitle,
  PlaceholderLine,
} from "./styles";
import {
  MOVE_DIRECTION_DOWN,
  MOVE_DIRECTION_UP,
  moveItemInArray,
} from "@/utils/sortOptions";

import COLORS from "@repo/ui/colors";
import { FolderIcon } from "@/assets/icons";
import { MonoText } from "@/components/UI/Monotext";

type Props = {
  activeTab: ContentTab;
  selectedCollection: CollectionRow | null;
  collectionContents: CollectionContentRow[];
  collections: CollectionRow[];
  setCollections: Dispatch<SetStateAction<CollectionRow[]>>;
  setSelectedCollection: (collection: CollectionRow) => void;
  onDelete: (id: string, type: CollectionTableType) => void;
  onEditCollection: (id: string) => void;
  setContentsMap: Dispatch<
    SetStateAction<Record<string, CollectionContentRow[]>>
  >;
  setActiveTab: (tab: ContentTab) => void;
};

export default function ContentTabPanel({
  activeTab,
  selectedCollection,
  collectionContents,
  collections,
  setCollections,
  setSelectedCollection,
  onDelete,
  onEditCollection,
  setContentsMap,
  setActiveTab,
}: Props) {
  const { t } = useTranslation();

  const handleMoveUp = (id: string) => {
    if (selectedCollection) {
      setContentsMap((current) => ({
        ...current,
        [selectedCollection.id]: moveItemInArray(
          current[selectedCollection.id] ?? [],
          id,
          MOVE_DIRECTION_UP,
        ),
      }));
      return;
    }

    setCollections((current) =>
      moveItemInArray(current, id, MOVE_DIRECTION_UP),
    );
  };

  const handleMoveDown = (id: string) => {
    if (selectedCollection) {
      setContentsMap((current) => ({
        ...current,
        [selectedCollection.id]: moveItemInArray(
          current[selectedCollection.id] ?? [],
          id,
          MOVE_DIRECTION_DOWN,
        ),
      }));
      return;
    }

    setCollections((current) =>
      moveItemInArray(current, id, MOVE_DIRECTION_DOWN),
    );
  };

  const renderCollectionsContent = () => {
    if (selectedCollection) {
      const data = collectionContents;

      if (!data || data.length === 0) {
        return (
          <EmptyCollectionCard>
            <FolderIcon
              width={54}
              height={42}
              color={COLORS.neutral.GRAY_400}
            />
            <EmptyCollectionText>
              <EmptyCollectionTitle>
                {t("contents.emptyCollection.title")}
              </EmptyCollectionTitle>
              <MonoText $use="Body_Medium">
                {t("contents.emptyCollection.description")}
              </MonoText>
            </EmptyCollectionText>
          </EmptyCollectionCard>
        );
      }

      return (
        <CollectionTable
          type={COLLECTION_TABLE_TYPE.CONTENTS}
          data={data}
          onDelete={(id) => onDelete(id, COLLECTION_TABLE_TYPE.CONTENTS)}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
        />
      );
    }

    return (
      <CollectionTable
        type={COLLECTION_TABLE_TYPE.COLLECTIONS}
        data={collections}
        onRowClick={setSelectedCollection}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        onDelete={(id) => onDelete(id, COLLECTION_TABLE_TYPE.COLLECTIONS)}
        onEdit={onEditCollection}
        onSettings={() => setActiveTab(SETTINGS)}
      />
    );
  };

  const renderPlaceholder = () => {
    const activeItem = CONTENT_TABS.find((tab) => tab.key === activeTab);
    if (activeItem?.descriptionKey) return t(activeItem.descriptionKey);
    return activeItem?.description ?? t(CONTENTS_KEYS.placeholders.collections);
  };

  if (activeTab === APPEARANCE) return <AppearanceContent />;
  if (activeTab === SETTINGS) return <AdmissionRequirements />;
  if (activeTab === COUPONS) return <CouponTable data={couponData} />;
  if (activeTab === COLLECTIONS) return renderCollectionsContent();

  return <PlaceholderLine>{renderPlaceholder()}</PlaceholderLine>;
}
