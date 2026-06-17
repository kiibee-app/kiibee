"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import LeftIcon from "@/assets/icons/LeftIcon";
import { CrossIcon } from "@/assets/icons/crossIcon";
import { SearchIcon } from "@/assets/icons/searchBarIcon";
import { MonoText } from "@/components/UI/Monotext";
import type { RentedMediaItem } from "@/utils/dummyData/viewerRentedMockData";
import type { PurchasedCollectionItem } from "@/utils/dummyData/viewerPurchasedMockData";
import {
  SingleContentBody,
  SingleContentHero,
} from "@/components/Feature/SingleContentPage/ContentSections";
import { SCROLL_TO_START_OPTIONS } from "@/utils/Constants";
import {
  getPurchasedMediaDetailView,
  purchasedMediaToTutorial,
  rentedMediaToPurchasedItem,
} from "@/utils/purchasedMediaToTutorial";
import CollectionContent from "@/components/Feature/SingleCollectionHero/CollectionContent";
import { getCollectionBadgeText, type RentedMode } from "@/utils/viewerRented";
import { PURCHASED_MEDIA_TYPES } from "@/utils/dummyData/viewerPurchasedMockData";
import {
  HeaderBackButton,
  HeaderSearchArea as SearchArea,
  HeaderSearchButton as SearchButton,
  HeaderSearchInput as SearchInput,
  HeaderTitleWrap,
  PageHeader,
} from "./styles";
import {
  DetailBodyWrap,
  DetailHeroWrap,
  DetailPdfLayout,
  DetailTopWrap,
  EmptyStateWrap,
} from "./purchasedCollectionDetail.styles";
import { SearchClearButton } from "@/components/UI/GenericTabs/styles";

type Props = {
  collection: PurchasedCollectionItem | undefined;
  mediaItems: RentedMediaItem[];
  onBack: () => void;
  initialSelectedMediaId?: string | null;
  onSelectMedia?: (mediaId: string) => void;
  title: string;
  mode: RentedMode;
};

export default function PurchasedCollectionDetail({
  collection,
  mediaItems,
  onBack,
  initialSelectedMediaId = null,
  onSelectMedia,
  title,
  mode,
}: Props) {
  const { t } = useTranslation();
  const detailAnchorRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(
    initialSelectedMediaId,
  );
  const [searchValue, setSearchValue] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const statusLabel = getCollectionBadgeText(mode);

  const purchasedItems = useMemo(
    () => mediaItems.map(rentedMediaToPurchasedItem),
    [mediaItems],
  );

  const tutorials = useMemo(
    () => purchasedItems.map((item) => purchasedMediaToTutorial(item)),
    [purchasedItems],
  );

  const selectedMedia = useMemo(
    () => purchasedItems.find((item) => item.id === selectedMediaId),
    [purchasedItems, selectedMediaId],
  );
  const isPdfLayout = selectedMedia?.mediaType === PURCHASED_MEDIA_TYPES.PDF;
  const hasSearchText = Boolean(searchValue.trim());

  const filteredTutorials = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) return tutorials;

    return tutorials.filter((tutorial) =>
      tutorial.title?.toLowerCase().includes(query),
    );
  }, [tutorials, searchValue]);

  const handleSearchToggle = () => {
    setIsSearchOpen((prev) => {
      const next = !prev;

      if (!next) {
        setSearchValue("");
      }

      return next;
    });
  };

  const handleSearchClear = () => {
    setSearchValue("");
    searchInputRef.current?.focus();
  };

  const itemDetailView = useMemo(() => {
    if (!collection || !selectedMedia) return null;
    const detailView = getPurchasedMediaDetailView(
      selectedMedia,
      collection,
      t,
    );

    return {
      ...detailView,
      body: {
        ...detailView.body,
        statusLabel,
      },
    };
  }, [collection, selectedMedia, statusLabel, t]);

  useEffect(() => {
    setSelectedMediaId(initialSelectedMediaId);
  }, [initialSelectedMediaId]);

  useEffect(() => {
    if (!selectedMediaId) return;
    detailAnchorRef.current?.scrollIntoView(SCROLL_TO_START_OPTIONS);
  }, [selectedMediaId]);

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  if (!collection) {
    return (
      <EmptyStateWrap>
        <MonoText $use="Body_Medium">Collection not found.</MonoText>
      </EmptyStateWrap>
    );
  }

  return (
    <>
      <DetailTopWrap ref={detailAnchorRef}>
        <PageHeader>
          <HeaderTitleWrap>
            <HeaderBackButton
              type="button"
              aria-label={t("common.back")}
              onClick={onBack}
            >
              <LeftIcon style={{ transform: "rotate(180deg)" }} />
            </HeaderBackButton>
            <MonoText $use="H4_SemiBold">{title}</MonoText>
            <SearchArea $open={isSearchOpen}>
              <SearchButton
                type="button"
                aria-label={t("common.toggleSearch")}
                onClick={handleSearchToggle}
              >
                <SearchIcon width={18} height={18} />
              </SearchButton>

              <SearchInput
                ref={searchInputRef}
                $open={isSearchOpen}
                placeholder={t("creators.search")}
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
              />

              {isSearchOpen && hasSearchText ? (
                <SearchClearButton
                  type="button"
                  aria-label={t("common.clearSearch")}
                  onClick={handleSearchClear}
                >
                  <CrossIcon width={20} height={20} />
                </SearchClearButton>
              ) : null}
            </SearchArea>
          </HeaderTitleWrap>
        </PageHeader>

        {itemDetailView ? (
          isPdfLayout ? (
            <DetailPdfLayout>
              <DetailHeroWrap $isPdf>
                <SingleContentHero hero={itemDetailView.hero} isPdfLayout />
              </DetailHeroWrap>
              <DetailBodyWrap $isPdf>
                <SingleContentBody {...itemDetailView.body} />
              </DetailBodyWrap>
            </DetailPdfLayout>
          ) : (
            <>
              <DetailHeroWrap>
                <SingleContentHero hero={itemDetailView.hero} />
              </DetailHeroWrap>
              <DetailBodyWrap>
                <SingleContentBody {...itemDetailView.body} />
              </DetailBodyWrap>
            </>
          )
        ) : (
          <>
            <DetailHeroWrap>
              <SingleContentHero
                hero={{
                  image: collection.coverSrc,
                  imageAlt: collection.title,
                  categoryLabel: statusLabel,
                }}
              />
            </DetailHeroWrap>
            <DetailBodyWrap>
              <SingleContentBody
                creator={{ name: collection.author }}
                statusLabel={statusLabel}
                title={collection.title}
                descriptions={collection.descriptionLines}
                primaryAction={{
                  label: statusLabel,
                  disabled: true,
                }}
                metaItems={[
                  {
                    label: "Access",
                    value: collection.accessPeriodLabel ?? "Lifetime access",
                  },
                ]}
              />
            </DetailBodyWrap>
          </>
        )}
      </DetailTopWrap>

      <CollectionContent
        videos={filteredTutorials}
        embedded
        selectedVideoId={selectedMediaId}
        onSelectVideo={(mediaId) => {
          setSelectedMediaId(mediaId);
          onSelectMedia?.(mediaId);
        }}
      />
    </>
  );
}
