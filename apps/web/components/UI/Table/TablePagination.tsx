"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import {
  PaginationWrapper,
  PaginationButton,
  PageNumberButton,
} from "./styles";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";

type Props = {
  totalPages: number;
  currentPage: number;
  pageNumbers: number[];
  onChange: (page: number) => void;
};

export default function Pagination({
  totalPages,
  currentPage,
  pageNumbers,
  onChange,
}: Props) {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  return (
    <PaginationWrapper>
      <PaginationButton
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
          {t("common.previous")}
        </MonoText>
      </PaginationButton>

      {pageNumbers.map((p) => (
        <PageNumberButton
          key={p}
          $active={p === currentPage}
          onClick={() => onChange(p)}
        >
          <MonoText
            $use="Body_Medium"
            color={
              p === currentPage ? COLORS.primary.WHITE : COLORS.neutral.GRAY
            }
          >
            {p}
          </MonoText>
        </PageNumberButton>
      ))}

      <PaginationButton
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
          {t("common.next")}
        </MonoText>
      </PaginationButton>
    </PaginationWrapper>
  );
}
