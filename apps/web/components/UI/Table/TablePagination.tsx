"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import {
  PaginationMeta,
  PaginationMetaLabel,
  PaginationMetaSelectWrap,
  PaginationMetaSelect,
  PaginationMetaSelectChevron,
  PaginationWrapper,
  PaginationButton,
  PageNumberButton,
  PaginationControls,
  PaginationNumberGroup,
  PaginationChevron,
  PaginationNextChevron,
} from "./styles";
import { LeftIcon } from "@/assets/icons";
import { PAGE_SIZE_OPTIONS } from "@/utils/common";

type Props = {
  totalPages: number;
  currentPage: number;
  pageNumbers: number[];
  rowsPerPage: number;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onChange: (page: number) => void;
};

export default function Pagination({
  totalPages,
  currentPage,
  pageNumbers,
  rowsPerPage,
  onRowsPerPageChange,
  onChange,
}: Props) {
  const { t } = useTranslation();

  return (
    <PaginationWrapper>
      <PaginationMeta>
        <PaginationMetaLabel>{t("table.showing")}</PaginationMetaLabel>
        <PaginationMetaSelectWrap>
          <PaginationMetaSelect
            value={rowsPerPage}
            onChange={(event) =>
              onRowsPerPageChange(Number(event.target.value))
            }
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </PaginationMetaSelect>
          <PaginationMetaSelectChevron>
            <LeftIcon width={12} height={12} />
          </PaginationMetaSelectChevron>
        </PaginationMetaSelectWrap>
        <PaginationMetaLabel>
          {t("table.outOf")} {totalPages}
        </PaginationMetaLabel>
      </PaginationMeta>

      {totalPages > 1 ? (
        <PaginationControls>
          <PaginationButton
            onClick={() => onChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label={t("common.previous")}
          >
            <PaginationNextChevron>
              <LeftIcon />
            </PaginationNextChevron>
          </PaginationButton>

          <PaginationNumberGroup>
            {pageNumbers.map((p) => (
              <PageNumberButton
                key={p}
                $active={p === currentPage}
                onClick={() => onChange(p)}
                aria-label={t("table.paginationPage", { page: p })}
              >
                {p}
              </PageNumberButton>
            ))}
          </PaginationNumberGroup>

          <PaginationButton
            onClick={() => onChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label={t("common.next")}
          >
            <PaginationChevron>
              <LeftIcon />
            </PaginationChevron>
          </PaginationButton>
        </PaginationControls>
      ) : null}
    </PaginationWrapper>
  );
}
