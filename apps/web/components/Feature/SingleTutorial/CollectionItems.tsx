"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { LeftIcon } from "@/assets/icons";
import type { TutorialVideo } from "@/utils/types";
import { getFeedPageSlice } from "@/utils/feedContentToTutorial";
import CollectionItemCard from "./CollectionItemCard";
import {
  CollectionCardWrap,
  CollectionGrid,
  CollectionHeader,
  CollectionHeaderActions,
  CollectionSection,
  CollectionSectionArrow,
  CollectionSectionArrows,
  CollectionSectionTitle,
  CollectionTitleGroup,
} from "./styles";

export const COLLECTION_ITEMS_PAGE_SIZE = 4;

type Props = {
  videos: TutorialVideo[];
  collectionId?: string;
};

export default function CollectionItems({ videos, collectionId }: Props) {
  const { t } = useTranslation();
  const [pageStart, setPageStart] = useState(0);
  const totalItems = videos.length;
  const canSlide = totalItems > COLLECTION_ITEMS_PAGE_SIZE;
  const canGoPrev = pageStart > 0;
  const canGoNext = pageStart + COLLECTION_ITEMS_PAGE_SIZE < totalItems;

  const movePrev = useCallback(() => {
    setPageStart((prev) => Math.max(prev - COLLECTION_ITEMS_PAGE_SIZE, 0));
  }, []);

  const moveNext = useCallback(() => {
    setPageStart((prev) => {
      if (totalItems <= COLLECTION_ITEMS_PAGE_SIZE) return prev;
      return Math.min(
        prev + COLLECTION_ITEMS_PAGE_SIZE,
        totalItems - COLLECTION_ITEMS_PAGE_SIZE,
      );
    });
  }, [totalItems]);

  if (!videos.length) return null;

  const href = collectionId
    ? `/single-collection?id=${collectionId}`
    : "/tutorial-videos";

  const visibleVideos = getFeedPageSlice(
    videos,
    pageStart,
    COLLECTION_ITEMS_PAGE_SIZE,
  );

  return (
    <CollectionSection>
      <CollectionHeader>
        <CollectionTitleGroup as={Link} href={href}>
          <CollectionSectionTitle>
            {t("singleTutorial.otherItemsInCollection")}
          </CollectionSectionTitle>
          <LeftIcon width={14} height={14} />
        </CollectionTitleGroup>
        <CollectionHeaderActions>
          {canSlide ? (
            <CollectionSectionArrows>
              {canGoPrev ? (
                <CollectionSectionArrow
                  type="button"
                  onClick={movePrev}
                  aria-label={t("common.previous")}
                >
                  <LeftIcon style={{ transform: "rotate(180deg)" }} />
                </CollectionSectionArrow>
              ) : null}
              <CollectionSectionArrow
                type="button"
                disabled={!canGoNext}
                aria-disabled={!canGoNext}
                onClick={moveNext}
                aria-label={t("common.next")}
              >
                <LeftIcon />
              </CollectionSectionArrow>
            </CollectionSectionArrows>
          ) : null}
        </CollectionHeaderActions>
      </CollectionHeader>
      <CollectionGrid>
        {visibleVideos.map((video) => (
          <CollectionCardWrap key={video.id}>
            <CollectionItemCard video={video} />
          </CollectionCardWrap>
        ))}
      </CollectionGrid>
    </CollectionSection>
  );
}
