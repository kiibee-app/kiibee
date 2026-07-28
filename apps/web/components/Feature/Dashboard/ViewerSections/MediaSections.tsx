"use client";

import { useState } from "react";

import { MonoText } from "@/components/UI/Monotext";
import GenericCard from "@/components/UI/GenericCard";
import GenericButton from "@/components/UI/GenericButton";
import {
  VARIANT,
  SORT_ARROW_UP,
  SORT_ARROW_DOWN,
  BUY_PREFIX,
  RENT_PREFIX,
  SORT_DROPDOWN_VARIANT,
} from "@/utils/Constants";
import { formatPriceLabel } from "@/utils/contentPricingActions";
import COLORS from "@repo/ui/colors";
import { VideoIcon, WebIcon } from "@/assets/icons";
import AudioFileIcon from "@/assets/icons/AudioFileIcon";
import PdfFileIcon from "@/assets/icons/PdfFileIcon";
import LeftIcon from "@/assets/icons/LeftIcon";
import { useTranslation } from "react-i18next";
import {
  getRentedMediaSections,
  COLLECTION_ACCESS_STATUS,
  RENTED_SECTION_KEYS,
  RENTED_MODES,
  type RentedSectionKey,
  type RentedMode,
  type RentedMediaItem,
  type RentedMediaSectionKey,
  type RentedMediaSectionItems,
  getMediaAction,
  getMediaLabel,
  MEDIA_SORT_KEY_LIST,
  sortViewerMedia,
  type CollectionSortKey,
  MEDIA_ICON_SIZE,
} from "@/utils/viewerRented";
import SortDropdown, {
  type DropdownOption,
} from "@/components/UI/SortDropdown";
import {
  MediaGrid,
  MediaTypePill,
  SectionHeader,
  SectionTitle,
  SectionTitleRow,
  InlineSectionArrow,
  TwoButtonRow,
  SectionBlock,
  CollectionMetaHeader,
  CollectionMetaHeaderItem,
  CollectionMetaSortArrow,
} from "./styles";
import SectionPaginationArrows from "./SectionPaginationArrows";

const ALL_CATEGORIES = "__all_categories__";

type Props = {
  mode: RentedMode;
  sectionItems: RentedMediaSectionItems;
  sectionTotals: Record<Exclude<RentedSectionKey, "collections">, number>;
  canSlide: (section: RentedSectionKey, totalItems: number) => boolean;
  canGoPrev: (section: RentedSectionKey) => boolean;
  canGoNext: (section: RentedSectionKey, totalItems: number) => boolean;
  movePrev: (section: RentedSectionKey, totalItems: number) => void;
  moveNext: (section: RentedSectionKey, totalItems: number) => void;
  onMediaPrimaryAction?: (item: RentedMediaItem) => void;
  onCardClick?: (item: RentedMediaItem) => void;
  expandedSection?: Exclude<RentedSectionKey, "collections"> | null;
  onOpenSection?: (section: Exclude<RentedSectionKey, "collections">) => void;
};

const MEDIA_TYPE_ICON: Record<
  string,
  React.ComponentType<{ width: number; height: number; color: string }>
> = {
  [RENTED_SECTION_KEYS.AUDIOS]: AudioFileIcon,
  [RENTED_SECTION_KEYS.PDFS]: PdfFileIcon,
  [RENTED_SECTION_KEYS.WEBS]: WebIcon,
  [RENTED_SECTION_KEYS.VIDEOS]: VideoIcon,
};

function MediaTypeIcon({ type }: { type: RentedSectionKey }) {
  const Icon = MEDIA_TYPE_ICON[type] ?? VideoIcon;
  return (
    <Icon
      width={MEDIA_ICON_SIZE}
      height={MEDIA_ICON_SIZE}
      color={COLORS.neutral.BLACK}
    />
  );
}

export default function MediaSections({
  mode,
  sectionItems,
  sectionTotals,
  canSlide,
  canGoPrev,
  canGoNext,
  movePrev,
  moveNext,
  onMediaPrimaryAction,
  onCardClick,
  expandedSection,
  onOpenSection,
}: Props) {
  const { t } = useTranslation();
  const [activeSortKey, setActiveSortKey] = useState<CollectionSortKey | null>(
    null,
  );
  const [selectedCategories, setSelectedCategories] = useState<
    Partial<Record<RentedMediaSectionKey, string>>
  >({});

  const toggleSort = (key: CollectionSortKey) => {
    setActiveSortKey((prev) => (prev === key ? null : key));
  };

  const isCurrent = mode === RENTED_MODES.CURRENTLY;
  const canOpenMediaDetail = Boolean(onMediaPrimaryAction);

  const getMediaPrimaryActionHandler = (item: RentedMediaItem) =>
    onMediaPrimaryAction ? () => onMediaPrimaryAction(item) : undefined;

  return (
    <>
      {getRentedMediaSections(t).map((section) => {
        if (
          !sectionItems[section.key] ||
          sectionItems[section.key].length === 0
        )
          return null;

        const effectiveSortKey =
          expandedSection === section.key ? activeSortKey : null;
        const availableCategories = Array.from(
          new Map(
            sectionItems[section.key]
              .map((item) => item.category.trim())
              .filter(Boolean)
              .map((category) => [category.toLocaleLowerCase(), category]),
          ).values(),
        ).sort((a, b) =>
          a.localeCompare(b, undefined, { sensitivity: "base" }),
        );
        const categoryOptions: DropdownOption[] = [
          {
            value: ALL_CATEGORIES,
            label: t("viewerRented.allCategories"),
          },
          ...availableCategories.map((category) => ({
            value: category,
            label: category,
          })),
        ];
        const selectedCategory =
          selectedCategories[section.key] ?? ALL_CATEGORIES;
        const effectiveCategory = availableCategories.includes(selectedCategory)
          ? selectedCategory
          : ALL_CATEGORIES;
        const categoryFilteredItems =
          effectiveCategory === ALL_CATEGORIES
            ? sectionItems[section.key]
            : sectionItems[section.key].filter(
                (item) => item.category.trim() === effectiveCategory,
              );
        const displayItems = effectiveSortKey
          ? sortViewerMedia(categoryFilteredItems, effectiveSortKey)
          : categoryFilteredItems;

        return (
          <SectionBlock key={section.title}>
            <SectionHeader>
              <SectionTitleRow>
                <SectionTitle>{section.title}</SectionTitle>
                {!expandedSection &&
                canOpenMediaDetail &&
                (section.key === RENTED_SECTION_KEYS.VIDEOS ||
                  section.key === RENTED_SECTION_KEYS.AUDIOS ||
                  section.key === RENTED_SECTION_KEYS.PDFS ||
                  section.key === RENTED_SECTION_KEYS.WEBS) ? (
                  <InlineSectionArrow
                    type="button"
                    aria-label={`Expand ${section.title} section`}
                    onClick={() => onOpenSection?.(section.key)}
                  >
                    <LeftIcon />
                  </InlineSectionArrow>
                ) : null}
              </SectionTitleRow>
              {expandedSection === section.key ? (
                <CollectionMetaHeader>
                  {MEDIA_SORT_KEY_LIST.map((key) => {
                    const isActive = effectiveSortKey === key;
                    return (
                      <CollectionMetaHeaderItem
                        key={key}
                        type="button"
                        $active={isActive}
                        aria-pressed={isActive}
                        onClick={() => toggleSort(key)}
                      >
                        {t(`collections.sort.${key}`)}
                        <CollectionMetaSortArrow aria-hidden>
                          <span>{SORT_ARROW_UP}</span>
                          <span>{SORT_ARROW_DOWN}</span>
                        </CollectionMetaSortArrow>
                      </CollectionMetaHeaderItem>
                    );
                  })}
                  <SortDropdown
                    options={categoryOptions}
                    value={effectiveCategory}
                    onChange={(category) =>
                      setSelectedCategories((prev) => ({
                        ...prev,
                        [section.key]: category,
                      }))
                    }
                    renderSelectedLabel={(value, option) =>
                      value === ALL_CATEGORIES
                        ? t("viewerRented.categories")
                        : option?.label
                    }
                    width="176px"
                    dropdownWidth="200px"
                    variant={SORT_DROPDOWN_VARIANT.SURFACE}
                  />
                </CollectionMetaHeader>
              ) : !expandedSection ? (
                <SectionPaginationArrows
                  sectionKey={section.key}
                  totalItems={sectionTotals[section.key]}
                  canSlide={canSlide}
                  canGoPrev={canGoPrev}
                  canGoNext={canGoNext}
                  movePrev={movePrev}
                  moveNext={moveNext}
                />
              ) : null}
            </SectionHeader>
            <MediaGrid>
              {displayItems.map((item) => {
                const shouldShowAccessCta =
                  mode === RENTED_MODES.CURRENTLY ||
                  item.accessStatus === COLLECTION_ACCESS_STATUS.PURCHASED;

                return (
                  <GenericCard
                    key={item.id}
                    coverImage
                    image={item.thumbSrc}
                    title={<MonoText $use="H5_Medium">{item.title}</MonoText>}
                    subtitle={
                      <MonoText $use="Body_Medium">{item.author}</MonoText>
                    }
                    badge={
                      <MonoText $use="Body_Bold">{item.category}</MonoText>
                    }
                    onClick={onCardClick ? () => onCardClick(item) : undefined}
                    footer={
                      shouldShowAccessCta ? (
                        <GenericButton
                          variant={VARIANT.SECONDARY}
                          size="md"
                          fullWidth
                          onClick={getMediaPrimaryActionHandler(item)}
                        >
                          {getMediaAction(section.key, t)}
                        </GenericButton>
                      ) : (
                        <TwoButtonRow>
                          <GenericButton
                            variant={VARIANT.SECONDARY}
                            size="md"
                            fullWidth
                          >
                            {formatPriceLabel(BUY_PREFIX, item.buyPrice) ??
                              t("pricingLabels.buy")}
                          </GenericButton>
                          <GenericButton
                            variant={VARIANT.SECONDARY}
                            size="md"
                            fullWidth
                          >
                            {formatPriceLabel(RENT_PREFIX, item.rentPrice) ??
                              t("pricingLabels.rent")}
                          </GenericButton>
                        </TwoButtonRow>
                      )
                    }
                  >
                    <MonoText
                      $use="Body_Medium"
                      color={
                        isCurrent ? COLORS.primary.RED : COLORS.neutral.GRAY_400
                      }
                    >
                      {item.expiryText}
                    </MonoText>
                    <MediaTypePill>
                      <MediaTypeIcon type={section.key} />
                      <MonoText $use="Body_Bold">
                        {getMediaLabel(section.key, t)}
                      </MonoText>
                    </MediaTypePill>
                  </GenericCard>
                );
              })}
            </MediaGrid>
          </SectionBlock>
        );
      })}
    </>
  );
}
