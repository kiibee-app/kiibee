"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import {
  PaginationMeta,
  PaginationMetaLabel,
  PaginationWrapper,
  PaginationButton,
  PageNumberButton,
  PaginationControls,
  PaginationNumberGroup,
  PaginationChevron,
  PaginationNextChevron,
  PaginationEllipsis,
} from "./styles";
import { LeftIcon } from "@/assets/icons";
import { PAGE_SIZE_OPTIONS } from "@/utils/common";
import type { PaginationItem } from "@/utils/pagination";
import PageSizeSelect from "./PageSizeSelect";

type Props = {
  totalPages: number;
  currentPage: number;
  paginationItems: PaginationItem[];
  rowsPerPage: number;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onChange: (page: number) => void;
};

export default function Pagination({
  totalPages,
  currentPage,
  paginationItems,
  rowsPerPage,
  onRowsPerPageChange,
  onChange,
}: Props) {
  const { t } = useTranslation();

  return (
    <PaginationWrapper>
      <PaginationMeta>
        <PaginationMetaLabel>{t("table.showing")}</PaginationMetaLabel>
        <PageSizeSelect
          value={rowsPerPage}
          options={PAGE_SIZE_OPTIONS}
          onChange={onRowsPerPageChange}
        />
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
            {paginationItems.map((item) =>
              item.type === "ellipsis" ? (
                <PaginationEllipsis key={item.key} aria-hidden="true">
                  ...
                </PaginationEllipsis>
              ) : (
                <PageNumberButton
                  key={item.page}
                  $active={item.page === currentPage}
                  onClick={() => onChange(item.page)}
                  aria-label={t("table.paginationPage", { page: item.page })}
                  aria-current={item.page === currentPage ? "page" : undefined}
                >
                  {item.page}
                </PageNumberButton>
              ),
            )}
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
