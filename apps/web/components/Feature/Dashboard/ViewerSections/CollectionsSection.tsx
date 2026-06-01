"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { authStorage } from "@/lib/auth/authStorage";
import { PATHS } from "@/utils/path";
import { MonoText } from "@/components/UI/Monotext";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";
import COLORS from "@repo/ui/colors";
import PlaylistIcon from "@/assets/icons/PlaylistIcon";
import LeftIcon from "@/assets/icons/LeftIcon";
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
}: Props) {
  const router = useRouter();
  const hasSession = authStorage.hasSession();

  const handleCtaClick = (e: React.MouseEvent<HTMLElement>, itemId: string) => {
    if (!hasSession) {
      e.preventDefault();
      const nextUrl = window.location.pathname + window.location.search;
      router.push(`${PATHS.AUTH_LOGIN}?next=${encodeURIComponent(nextUrl)}`);
    }
  };

  const isCurrent = mode === RENTED_MODES.CURRENTLY;
  const isPurchased = mode === RENTED_MODES.PURCHASED;
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
                  {item.elementCount} elements
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
                        asAnchor
                        href={`/single-collection?id=${item.id}`}
                        onClick={(e) => handleCtaClick(e, item.id)}
                        variant={
                          isSecondary ? VARIANT.SOFT_OUTLINE : VARIANT.PRIMARY
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
