"use client";

import { useMemo, useState, useCallback } from "react";
import { MonoText } from "@/components/UI/Monotext";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";
import COLORS from "@repo/ui/colors";
import PlaylistIcon from "@/assets/icons/PlaylistIcon";
import LeftIcon from "@/assets/icons/LeftIcon";
import { useProtectedContentNavigation } from "@/hooks/useProtectedContentNavigation";
import type {
  RentedCollectionItem,
  RentedMode,
} from "@/utils/dummyData/viewerRentedMockData";
import {
  ACTIVE_RENTAL_TEXT,
  COLLECTION_SORT_KEY_LIST,
  COLLECTION_SORT_LABELS,
  RENTED_BUTTON_TEXT,
  RENTED_MODES,
  RENTED_SECTION_KEYS,
  type CollectionSortKey,
  type RentedSectionKey,
  getCollectionBadgeText,
  getCollectionPrimaryActionText,
  sortViewerCollections,
} from "@/utils/viewerRented";
import {
  CollectionActionRow,
  CollectionBuyButton,
  CollectionCtaContent,
  CollectionCtaSubtext,
  CollectionRentButton,
  CollectionBadge,
  CollectionBody,
  CollectionCard,
  CollectionGrid,
  CollectionImage,
  CollectionImageWrap,
  ElementsPill,
  PassiveActionBlock,
  SectionHeader,
  SectionTitleRow,
  SectionTitle,
  InlineSectionArrow,
  CollectionMetaHeader,
  CollectionMetaHeaderItem,
  CollectionMetaSortArrow,
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
  onOpenSection?: () => void;
  showOpenSectionArrow?: boolean;
  showExpandedMetaHeader?: boolean;
  onCollectionPrimaryAction?: (item: RentedCollectionItem) => void;
  onCollectionClick?: (item: RentedCollectionItem) => void;
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
  onOpenSection,
  showOpenSectionArrow = false,
  showExpandedMetaHeader = false,
  onCollectionPrimaryAction,
  onCollectionClick,
}: Props) {
  const isCurrent = mode === RENTED_MODES.CURRENTLY;
  const isPurchased = mode === RENTED_MODES.PURCHASED;
  const { navigateToContent } = useProtectedContentNavigation();
  const [activeSortKey, setActiveSortKey] = useState<CollectionSortKey | null>(
    null,
  );

  const effectiveSortKey = showExpandedMetaHeader ? activeSortKey : null;

  const displayItems = useMemo(
    () => sortViewerCollections(items, effectiveSortKey),
    [items, effectiveSortKey],
  );

  const toggleSort = (key: CollectionSortKey) => {
    setActiveSortKey((prev) => (prev === key ? null : key));
  };

  const handleCardClick = useCallback(
    (item: RentedCollectionItem) => {
      if (onCollectionClick) {
        onCollectionClick(item);
      }
    },
    [onCollectionClick],
  );

  const handleActionClick = useCallback(
    (e: React.MouseEvent, href?: string) => {
      e.stopPropagation();
      if (href) {
        navigateToContent(href, false);
      }
    },
    [navigateToContent],
  );

  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <>
      <SectionHeader $withMetaHeader={showExpandedMetaHeader}>
        <SectionTitleRow>
          <SectionTitle>Collections</SectionTitle>
          {showOpenSectionArrow ? (
            <InlineSectionArrow
              type="button"
              aria-label="Open collections section"
              onClick={onOpenSection}
            >
              <LeftIcon />
            </InlineSectionArrow>
          ) : null}
        </SectionTitleRow>
        {showExpandedMetaHeader ? (
          <CollectionMetaHeader>
            {COLLECTION_SORT_KEY_LIST.map((key) => {
              const isActive = effectiveSortKey === key;
              return (
                <CollectionMetaHeaderItem
                  key={key}
                  type="button"
                  $active={isActive}
                  aria-pressed={isActive}
                  onClick={() => toggleSort(key)}
                >
                  {COLLECTION_SORT_LABELS[key]}
                  <CollectionMetaSortArrow aria-hidden>
                    <span>↑</span>
                    <span>↓</span>
                  </CollectionMetaSortArrow>
                </CollectionMetaHeaderItem>
              );
            })}
          </CollectionMetaHeader>
        ) : (
          <SectionPaginationArrows
            sectionKey={RENTED_SECTION_KEYS.COLLECTIONS}
            totalItems={totalItems}
            canSlide={canSlide}
            canGoPrev={canGoPrev}
            canGoNext={canGoNext}
            movePrev={movePrev}
            moveNext={moveNext}
          />
        )}
      </SectionHeader>
      <CollectionGrid>
        {displayItems.map((item) => (
          <CollectionCard
            key={item.id}
            onClick={() => handleCardClick(item)}
            style={{ cursor: onCollectionClick ? "pointer" : undefined }}
          >
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
                  {item.elementCount} elements
                </MonoText>
              </ElementsPill>

              <CollectionActionRow onClick={stopPropagation}>
                {isPurchased ? (
                  <CollectionBuyButton
                    className="collection-cta"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      if (onCollectionPrimaryAction) {
                        onCollectionPrimaryAction(item);
                      }
                    }}
                  >
                    <CollectionCtaContent>
                      <MonoText
                        $use="Body_SemiBold"
                        color={COLORS.primary.WHITE}
                      >
                        {getCollectionPrimaryActionText(mode)}
                      </MonoText>
                    </CollectionCtaContent>
                  </CollectionBuyButton>
                ) : item.actions?.length ? (
                  item.actions.map((action, index) => {
                    const isSecondary = index > 0;
                    const labelColor = isSecondary
                      ? COLORS.primary.BLACK
                      : COLORS.primary.WHITE;
                    const sublabelColor = isSecondary
                      ? COLORS.neutral.GRAY_500
                      : COLORS.primary.WHITE_90;

                    const Button = isSecondary
                      ? CollectionRentButton
                      : CollectionBuyButton;

                    return (
                      <Button
                        key={`${item.id}-${action.label}`}
                        className="collection-cta"
                        onClick={(e: React.MouseEvent) =>
                          handleActionClick(e, action.href)
                        }
                      >
                        <CollectionCtaContent>
                          <MonoText $use="Body_SemiBold" color={labelColor}>
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
                      </Button>
                    );
                  })
                ) : (
                  <>
                    <GenericButton
                      variant={VARIANT.PRIMARY}
                      size="md"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        if (isPurchased && onCollectionPrimaryAction) {
                          onCollectionPrimaryAction(item);
                        }
                      }}
                    >
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
                      <GenericButton variant={VARIANT.SOFT_OUTLINE} size="md">
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
