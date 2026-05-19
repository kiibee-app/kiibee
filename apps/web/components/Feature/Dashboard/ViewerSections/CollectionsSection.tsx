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
  RENTED_MODES,
  RENTED_SECTION_KEYS,
  type RentedSectionKey,
  getCollectionBadgeText,
  getCollectionPrimaryActionText,
} from "@/utils/viewerRented";
import { useTranslation } from "react-i18next";
import {
  CollectionActionRow,
  CollectionCtaContent,
  CollectionCtaSubtext,
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
  totalItems: number;
  canSlide: (section: RentedSectionKey, totalItems: number) => boolean;
  canGoPrev: (section: RentedSectionKey) => boolean;
  canGoNext: (section: RentedSectionKey, totalItems: number) => boolean;
  movePrev: (section: RentedSectionKey, totalItems: number) => void;
  moveNext: (section: RentedSectionKey, totalItems: number) => void;
};

export default function CollectionsSection({
  mode,
  items,
  totalItems,
  canSlide,
  canGoPrev,
  canGoNext,
  movePrev,
  moveNext,
}: Props) {
  const { t } = useTranslation();
  const isCurrent = mode === RENTED_MODES.CURRENTLY;
  const isPurchased = mode === RENTED_MODES.PURCHASED;

  return (
    <>
      <SectionHeader>
        <SectionTitle>
          {t("dashboard.viewerPurchased.sections.collections")}
        </SectionTitle>
        <SectionPaginationArrows
          sectionKey={RENTED_SECTION_KEYS.COLLECTIONS}
          totalItems={totalItems}
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
              {item.hideBadge ? null : (
                <CollectionBadge>
                  {getCollectionBadgeText(mode)}
                </CollectionBadge>
              )}
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
                  {t("dashboard.viewerPurchased.elementsCount", {
                    count: item.elementCount,
                  })}
                </MonoText>
              </ElementsPill>

              <CollectionActionRow>
                {item.actions?.length ? (
                  item.actions.map((action) => {
                    const isSecondary = action.variant === VARIANT.SECONDARY;
                    const labelColor = isSecondary
                      ? COLORS.primary.BLACK
                      : COLORS.primary.WHITE;
                    const sublabelColor = isSecondary
                      ? COLORS.neutral.GRAY_500
                      : COLORS.primary.WHITE_90;

                    return (
                      <GenericButton
                        key={`${item.id}-${action.label}`}
                        variant={
                          isSecondary ? VARIANT.SECONDARY : VARIANT.PRIMARY
                        }
                        size="md"
                        minWidth="120px"
                        className="collection-cta"
                      >
                        <CollectionCtaContent>
                          <MonoText $use="Body_Medium" color={labelColor}>
                            {action.label}
                          </MonoText>
                          {action.sublabel ? (
                            <CollectionCtaSubtext
                              style={{ color: sublabelColor }}
                            >
                              {action.sublabel}
                            </CollectionCtaSubtext>
                          ) : null}
                        </CollectionCtaContent>
                      </GenericButton>
                    );
                  })
                ) : (
                  <>
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
                  </>
                )}
              </CollectionActionRow>
            </CollectionBody>
          </CollectionCard>
        ))}
      </CollectionGrid>
    </>
  );
}
