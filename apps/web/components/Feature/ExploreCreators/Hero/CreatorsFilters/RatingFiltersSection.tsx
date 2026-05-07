"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { RATING_OPTIONS } from "@/utils/creatorFilters";
import { RatingStarPathIcon } from "@/assets/icons";
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
                      <RatingStarPathIcon />
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
