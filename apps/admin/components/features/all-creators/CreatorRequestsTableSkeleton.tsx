"use client";

import {
  RequestsTable,
  SkeletonLine,
  TableBodyCell,
  TableHeaderCell,
  TableScrollWrapper,
} from "./AllCreators.styles";
import type { CreatorRequestsTableSkeletonProps } from "../../../types/creator-requests-table-skeleton";
import { skeletonWidths } from "../../../utils/creator-requests-table-skeleton";
import { getCreatorTableColumns } from "./creatorTableColumns";

export function CreatorRequestsTableSkeleton({
  rowCount = 6,
}: CreatorRequestsTableSkeletonProps) {
  const creatorTableColumns = getCreatorTableColumns();

  return (
    <TableScrollWrapper aria-busy="true" aria-label="Loading creator requests">
      <RequestsTable>
        <thead>
          <tr>
            {creatorTableColumns.map((column) => (
              <TableHeaderCell key={column.key}>{column.label}</TableHeaderCell>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rowCount }, (_, rowIndex) => (
            <tr key={`skeleton-row-${rowIndex}`}>
              {creatorTableColumns.map((column, columnIndex) => (
                <TableBodyCell key={`skeleton-cell-${rowIndex}-${column.key}`}>
                  <SkeletonLine
                    $height={columnIndex === 0 ? "14px" : "12px"}
                    $width={
                      skeletonWidths[
                        (rowIndex + columnIndex) % skeletonWidths.length
                      ]
                    }
                  />
                </TableBodyCell>
              ))}
            </tr>
          ))}
        </tbody>
      </RequestsTable>
    </TableScrollWrapper>
  );
}
