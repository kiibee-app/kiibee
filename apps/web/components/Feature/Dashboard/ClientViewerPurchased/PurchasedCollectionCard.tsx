"use client";

import { MonoText } from "@/components/UI/Monotext";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";
import COLORS from "@repo/ui/colors";
import PlaylistIcon from "@/assets/icons/PlaylistIcon";
import type { PurchasedCollectionItem } from "@/utils/dummyData/viewerPurchasedMockData";
import {
  getCollectionBadgeText,
  getCollectionPrimaryActionText,
  RENTED_MODES,
} from "@/utils/viewerRented";
import {
  CollectionActionRow,
  CollectionBadge,
  CollectionBody,
  CollectionCard,
  CollectionImage,
  CollectionImageWrap,
  ElementsPill,
} from "../ViewerSections/styles";

type Props = {
  item: PurchasedCollectionItem;
};

export default function PurchasedCollectionCard({ item }: Props) {
  const mode = RENTED_MODES.PURCHASED;

  return (
    <CollectionCard>
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
          <MonoText $use="Body_Bold">{item.elementCount} elements</MonoText>
        </ElementsPill>

        <CollectionActionRow>
          <GenericButton variant={VARIANT.PRIMARY} size="md">
            {getCollectionPrimaryActionText(mode)}
          </GenericButton>
        </CollectionActionRow>
      </CollectionBody>
    </CollectionCard>
  );
}
