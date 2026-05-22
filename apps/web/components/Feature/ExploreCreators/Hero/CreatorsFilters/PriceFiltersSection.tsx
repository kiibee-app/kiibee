"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { NUMERIC_INPUT_MODE } from "@/utils/numericFields";
import { INPUT_TYPE } from "@/utils/ui";
import { PRICE_RANGE_FIELDS, PriceRangeFieldKey } from "@/types/exportCreators";
import {
  PriceField,
  PriceFieldLabel,
  PriceFields,
  PriceInput,
  PriceInputWrapper,
  PriceValue,
} from "../styles";

type PriceFiltersSectionProps = {
  priceRange: { min: string; max: string };
  handlePriceChange: (
    field: PriceRangeFieldKey,
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function PriceFiltersSection({
  priceRange,
  handlePriceChange,
}: PriceFiltersSectionProps) {
  const { t } = useTranslation();

  return (
    <PriceFields>
      <PriceField>
        <PriceFieldLabel>{t("creators.filters.price.minimum")}</PriceFieldLabel>
        <PriceInputWrapper>
          <PriceValue>{t("creators.filters.price.currency")}</PriceValue>
          <PriceInput
            type={INPUT_TYPE.TEXT}
            inputMode={NUMERIC_INPUT_MODE}
            placeholder="0"
            value={priceRange.min}
            onChange={handlePriceChange(PRICE_RANGE_FIELDS.MIN)}
          />
        </PriceInputWrapper>
      </PriceField>
      <PriceField>
        <PriceFieldLabel>{t("creators.filters.price.maximum")}</PriceFieldLabel>
        <PriceInputWrapper>
          <PriceValue>{t("creators.filters.price.currency")}</PriceValue>
          <PriceInput
            type={INPUT_TYPE.TEXT}
            inputMode={NUMERIC_INPUT_MODE}
            placeholder="0"
            value={priceRange.max}
            onChange={handlePriceChange(PRICE_RANGE_FIELDS.MAX)}
          />
        </PriceInputWrapper>
      </PriceField>
    </PriceFields>
  );
}

export default React.memo(PriceFiltersSection);
