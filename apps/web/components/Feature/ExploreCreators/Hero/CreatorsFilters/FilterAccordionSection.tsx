"use client";

import React from "react";
import {
  FilterSection,
  FilterSectionBody,
  FilterSectionBodyInner,
  FilterSectionButton,
  FilterSectionTitle,
} from "../styles";
import { BUTTON } from "@/utils/Constants";

type FilterAccordionSectionProps = {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  icon: React.ReactNode;
};

function FilterAccordionSection({
  title,
  isOpen,
  onToggle,
  children,
  icon,
}: FilterAccordionSectionProps) {
  return (
    <FilterSection>
      <FilterSectionButton
        type={BUTTON}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <FilterSectionTitle>{title}</FilterSectionTitle>
        {icon}
      </FilterSectionButton>
      <FilterSectionBody $open={isOpen}>
        <FilterSectionBodyInner $open={isOpen}>
          {children}
        </FilterSectionBodyInner>
      </FilterSectionBody>
    </FilterSection>
  );
}

export default React.memo(FilterAccordionSection);
