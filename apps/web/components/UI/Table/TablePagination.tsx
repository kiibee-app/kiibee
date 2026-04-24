"use client";

import React from "react";
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
  if (totalPages <= 1) return null;

  return (
    <PaginationWrapper>
      <PaginationButton
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
          Previous
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
          Next
        </MonoText>
      </PaginationButton>
    </PaginationWrapper>
  );
}
