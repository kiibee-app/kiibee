"use client";

import { MonoText } from "@/components/UI/Monotext";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";
import COLORS from "@repo/ui/colors";
import PlaylistIcon from "@/assets/icons/PlaylistIcon";
import type { PurchasedCollectionItem } from "@/utils/dummyData/viewerPurchasedMockData";
import {
  CollectionBody,
  CollectionBottomBlock,
  CollectionCoverImage,
  CollectionElementsPill,
  CollectionFlexSpacer,
  CollectionIconSlot,
  CollectionMetaTop,
  CollectionOwnedBadge,
  CollectionRoot,
  CollectionThumbWrap,
} from "./styles";

type Props = {
  item: PurchasedCollectionItem;
};

export default function PurchasedCollectionCard({ item }: Props) {
  return (
    <CollectionRoot>
      <CollectionThumbWrap>
        <CollectionOwnedBadge>Owned</CollectionOwnedBadge>
        <CollectionCoverImage
          src={item.coverSrc}
          alt=""
          fill
          sizes="(max-width: 600px) 100vw, 204px"
        />
      </CollectionThumbWrap>

      <CollectionBody>
        <CollectionMetaTop>
          <MonoText $use="H5_Medium">{item.title}</MonoText>
          <MonoText $use="Body_Medium" color={COLORS.neutral.BLACK}>
            {item.author}
          </MonoText>
          <CollectionElementsPill>
            <CollectionIconSlot>
              <PlaylistIcon
                width={22}
                height={22}
                color={COLORS.neutral.GRAY_700}
              />
            </CollectionIconSlot>
            <MonoText $use="Body_Bold">{item.elementCount} elements</MonoText>
          </CollectionElementsPill>
        </CollectionMetaTop>

        <CollectionFlexSpacer aria-hidden />

        <CollectionBottomBlock>
          <GenericButton
            type="button"
            variant={VARIANT.PRIMARY}
            style={{ width: "115px", height: "51px" }}
          >
            See content
          </GenericButton>
        </CollectionBottomBlock>
      </CollectionBody>
    </CollectionRoot>
  );
}
