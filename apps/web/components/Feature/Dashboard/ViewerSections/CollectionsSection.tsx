"use client";

import { MonoText } from "@/components/UI/Monotext";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";
import COLORS from "@repo/ui/colors";
import PlaylistIcon from "@/assets/icons/PlaylistIcon";
import type {
  RentedCollectionItem,
  RentedMode,
} from "@/utils/dummyData/viewerRentedMockData";
import {
  ACTIVE_RENTAL_TEXT,
  RENTED_BUTTON_TEXT,
  RENTED_SECTION_KEYS,
  type RentedSectionKey,
  getCollectionBadgeText,
  getCollectionPrimaryActionText,
} from "@/utils/viewerRented";
import {
  CollectionActionRow,
  CollectionBadge,
  CollectionBody,
  CollectionCard,
  CollectionGrid,
  CollectionImage,
  CollectionImageWrap,
  ElementsPill,
  PassiveActionBlock,
  SectionHeader,
  SectionTitle,
} from "./styles";
import SectionPaginationArrows from "./SectionPaginationArrows";

type Props = {
  mode: RentedMode;
  items: RentedCollectionItem[];
  canSlide: (section: RentedSectionKey, totalItems: number) => boolean;
  canGoPrev: (section: RentedSectionKey) => boolean;
  canGoNext: (section: RentedSectionKey, totalItems: number) => boolean;
  movePrev: (section: RentedSectionKey, totalItems: number) => void;
  moveNext: (section: RentedSectionKey, totalItems: number) => void;
};

export default function CollectionsSection({
  mode,
  items,
  canSlide,
  canGoPrev,
  canGoNext,
  movePrev,
  moveNext,
}: Props) {
  const isCurrent = mode === "currently";
  const isPurchased = mode === "purchased";

  return (
    <>
      <SectionHeader>
        <SectionTitle>Collections</SectionTitle>
        <SectionPaginationArrows
          sectionKey={RENTED_SECTION_KEYS.COLLECTIONS}
          totalItems={items.length}
          canSlide={canSlide}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
          movePrev={movePrev}
          moveNext={moveNext}
        />
      </SectionHeader>
      <CollectionGrid>
        {items.map((item) => (
          <CollectionCard key={item.id}>
            <CollectionImageWrap>
              <CollectionBadge>{getCollectionBadgeText(mode)}</CollectionBadge>
              <CollectionImage src={item.coverSrc} alt={item.title} />
            </CollectionImageWrap>

            <CollectionBody>
              <MonoText $use="H4_Medium">{item.title}</MonoText>
              <MonoText $use="Body_Medium">{item.author}</MonoText>

              <ElementsPill>
                <PlaylistIcon
                  width={20}
                  height={20}
                  color={COLORS.neutral.GRAY_700}
                />
                <MonoText $use="Body_Bold">
                  {item.elementCount} elements
                </MonoText>
              </ElementsPill>

              <CollectionActionRow>
                <GenericButton variant={VARIANT.PRIMARY} size="md">
                  {getCollectionPrimaryActionText(mode)}
                </GenericButton>
                {isCurrent ? (
                  <PassiveActionBlock>
                    <MonoText
                      $use="Body_Medium"
                      color={COLORS.neutral.GRAY_400}
                    >
                      {ACTIVE_RENTAL_TEXT.title}
                    </MonoText>
                    <MonoText $use="Body_Medium" color={COLORS.primary.RED}>
                      {ACTIVE_RENTAL_TEXT.expiresIn}
                    </MonoText>
                  </PassiveActionBlock>
                ) : isPurchased ? null : (
                  <GenericButton variant={VARIANT.SECONDARY} size="md">
                    {RENTED_BUTTON_TEXT.rent}
                  </GenericButton>
                )}
              </CollectionActionRow>
            </CollectionBody>
          </CollectionCard>
        ))}
      </CollectionGrid>
    </>
  );
}
