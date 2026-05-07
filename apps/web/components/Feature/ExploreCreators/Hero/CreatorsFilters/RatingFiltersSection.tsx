"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { RATING_OPTIONS } from "@/utils/creatorFilters";
import {
  CheckboxControl,
  CheckboxInput,
  OptionText,
  RatingList,
  RatingOption,
  RatingStars,
  StarIcon,
  StarIconWrap,
} from "../styles";

type RatingFiltersSectionProps = {
  selectedRating: number | null;
  setSelectedRating: (rating: number) => void;
};

function RatingFiltersSection({
  selectedRating,
  setSelectedRating,
}: RatingFiltersSectionProps) {
  const { t } = useTranslation();

  return (
    <RatingList
      role="radiogroup"
      aria-label={t("creators.filters.sections.rating")}
    >
      {RATING_OPTIONS.map((ratingValue) => {
        const isSelected = selectedRating === ratingValue;

        return (
          <RatingOption key={ratingValue}>
            <OptionText>
              <RatingStars aria-hidden="true">
                {Array.from({ length: 5 }, (_, index) => (
                  <StarIconWrap key={index}>
                    <StarIcon viewBox="0 0 24 24" $filled={index < ratingValue}>
                      <path d="M12 2.25L14.91 8.15L21.42 9.1L16.71 13.68L17.82 20.15L12 17.09L6.18 20.15L7.29 13.68L2.58 9.1L9.09 8.15L12 2.25Z" />
                    </StarIcon>
                  </StarIconWrap>
                ))}
              </RatingStars>
            </OptionText>
            <CheckboxInput
              type="radio"
              name="creator-rating-filter"
              aria-label={`${ratingValue} ${t("creators.filters.sections.rating")}`}
              checked={isSelected}
              onChange={() => setSelectedRating(ratingValue)}
            />
            <CheckboxControl $checked={isSelected} $round />
          </RatingOption>
        );
      })}
    </RatingList>
  );
}

export default React.memo(RatingFiltersSection);
