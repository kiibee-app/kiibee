"use client";

import type { CreatorPaginationProps } from "../../../types/creator-pagination";
import {
  Ellipsis,
  PaginationControlGroup,
  PaginationFooter,
  PaginationButton,
  PageSize,
} from "./AllCreators.styles";

export function CreatorPagination({
  startIndex,
  endIndex,
  totalItems,
  currentPage,
  totalPages,
  pageNumbers,
  pageSize,
  itemLabel = "items",
  onPageChange,
  onPageSizeChange,
}: CreatorPaginationProps) {
  return (
    <PaginationFooter>
      <span>
        Showing {startIndex + 1} to {endIndex} of {totalItems} {itemLabel}
      </span>
      <PaginationControlGroup>
        <PaginationButton
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          &lt;
        </PaginationButton>

        {pageNumbers[0] > 1 ? (
          <>
            <PaginationButton type="button" onClick={() => onPageChange(1)}>
              1
            </PaginationButton>
            <Ellipsis>...</Ellipsis>
          </>
        ) : null}

        {pageNumbers.map((pageNumber) => (
          <PaginationButton
            key={pageNumber}
            type="button"
            $active={currentPage === pageNumber}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </PaginationButton>
        ))}

        {pageNumbers[pageNumbers.length - 1] < totalPages ? (
          <>
            <Ellipsis>...</Ellipsis>
            <PaginationButton
              type="button"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </PaginationButton>
          </>
        ) : null}

        <PaginationButton
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          &gt;
        </PaginationButton>

        <PageSize
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
        >
          <option value={5}>5 / page</option>
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
        </PageSize>
      </PaginationControlGroup>
    </PaginationFooter>
  );
}
