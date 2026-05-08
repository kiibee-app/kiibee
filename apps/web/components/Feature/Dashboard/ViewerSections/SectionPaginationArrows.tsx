"use client";

import LeftIcon from "@/assets/icons/LeftIcon";
import type { RentedSectionKey } from "@/utils/viewerRented";
import { SectionArrow, SectionArrows } from "./styles";

type Props = {
  sectionKey: RentedSectionKey;
  totalItems: number;
  canSlide: (section: RentedSectionKey, totalItems: number) => boolean;
  canGoPrev: (section: RentedSectionKey) => boolean;
  canGoNext: (section: RentedSectionKey, totalItems: number) => boolean;
  movePrev: (section: RentedSectionKey, totalItems: number) => void;
  moveNext: (section: RentedSectionKey, totalItems: number) => void;
};

export default function SectionPaginationArrows({
  sectionKey,
  totalItems,
  canSlide,
  canGoPrev,
  canGoNext,
  movePrev,
  moveNext,
}: Props) {
  const showPrev = canGoPrev(sectionKey);
  const disableNext =
    !canSlide(sectionKey, totalItems) || !canGoNext(sectionKey, totalItems);

  return (
    <SectionArrows>
      {showPrev && (
        <SectionArrow
          type="button"
          onClick={() => movePrev(sectionKey, totalItems)}
        >
          <LeftIcon style={{ transform: "rotate(180deg)" }} />
        </SectionArrow>
      )}
      <SectionArrow
        type="button"
        disabled={disableNext}
        aria-disabled={disableNext}
        onClick={() => moveNext(sectionKey, totalItems)}
      >
        <LeftIcon />
      </SectionArrow>
    </SectionArrows>
  );
}
