"use client";

import { useTranslation } from "react-i18next";
import { MonoText } from "@/components/UI/Monotext";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";
import PlaylistIcon from "@/assets/icons/PlaylistIcon";
import type { PurchasedCollectionItem } from "@/utils/dummyData/viewerPurchasedMockData";
import COLORS from "@repo/ui/colors";
import { DASHBOARD_VIEWER_PREVIOUSLY_RENTED } from "@/utils/translationKeys";
import {
  CollectionActionColumn,
  CollectionActionButtonContent,
  CollectionActionButtonSubtext,
  CollectionActionsRow,
  CollectionBody,
  CollectionBottomBlock,
  CollectionCoverImage,
  CollectionElementsPill,
  CollectionFlexSpacer,
  CollectionIconSlot,
  CollectionMetaTop,
  CollectionRoot,
  CollectionThumbWrap,
} from "./styles";

type Props = {
  item: PurchasedCollectionItem;
};

export default function PreviouslyRentedCollectionCard({ item }: Props) {
  const { t } = useTranslation();

  const buyKr = item.buyPriceKr ?? 0;
  const rentKr = item.rentPriceKr ?? 0;

  return (
    <CollectionRoot>
      <CollectionThumbWrap>
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
            <MonoText $use="Body_Bold">
              {t(DASHBOARD_VIEWER_PREVIOUSLY_RENTED.elements, {
                count: item.elementCount,
              })}
            </MonoText>
          </CollectionElementsPill>
        </CollectionMetaTop>

        <CollectionFlexSpacer aria-hidden />

        <CollectionBottomBlock>
          <CollectionActionsRow>
            <CollectionActionColumn>
              <GenericButton
                type="button"
                variant={VARIANT.PRIMARY}
                fullWidth
                style={{ minHeight: 51, padding: "8px 12px", borderRadius: 16 }}
              >
                <CollectionActionButtonContent>
                  {t(DASHBOARD_VIEWER_PREVIOUSLY_RENTED.buttons.buy, {
                    price: buyKr,
                  })}
                  <CollectionActionButtonSubtext>
                    {t(
                      DASHBOARD_VIEWER_PREVIOUSLY_RENTED.buttons.contentSubtext,
                    )}
                  </CollectionActionButtonSubtext>
                </CollectionActionButtonContent>
              </GenericButton>
            </CollectionActionColumn>
            <CollectionActionColumn>
              <GenericButton
                type="button"
                variant={VARIANT.SECONDARY}
                fullWidth
                style={{ minHeight: 51, padding: "8px 12px", borderRadius: 16 }}
              >
                <CollectionActionButtonContent>
                  {t(DASHBOARD_VIEWER_PREVIOUSLY_RENTED.buttons.rent, {
                    price: rentKr,
                  })}
                  <CollectionActionButtonSubtext>
                    {t(
                      DASHBOARD_VIEWER_PREVIOUSLY_RENTED.buttons.contentSubtext,
                    )}
                  </CollectionActionButtonSubtext>
                </CollectionActionButtonContent>
              </GenericButton>
            </CollectionActionColumn>
          </CollectionActionsRow>
        </CollectionBottomBlock>
      </CollectionBody>
    </CollectionRoot>
  );
}
