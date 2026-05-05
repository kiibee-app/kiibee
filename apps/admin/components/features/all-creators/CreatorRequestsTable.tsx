"use client";

import type { CreatorRequestsTableProps } from "../../../types/creator-requests-table";
import {
  RequestTableRow,
  RequestsTable,
  TableBodyCell,
  TableHeaderCell,
} from "./AllCreators.styles";
import { getCreatorTableColumns } from "./creatorTableColumns";

export function CreatorRequestsTable({
  creators,
  onSelectCreator,
  onApproveCreator,
  onRejectCreator,
  activeAction,
  activeRequestId,
}: CreatorRequestsTableProps) {
  const creatorTableColumns = getCreatorTableColumns();

  return (
    <RequestsTable>
      <thead>
        <tr>
          {creatorTableColumns.map((column) => (
            <TableHeaderCell key={column.key}>{column.label}</TableHeaderCell>
          ))}
        </tr>
      </thead>
      <tbody>
        {creators.map((creator) => (
          <RequestTableRow
            key={creator.id}
            onClick={() => onSelectCreator(creator)}
          >
            {creatorTableColumns.map((column) => (
              <TableBodyCell key={`${creator.id}-${column.key}`}>
                {column.renderCell(creator, {
                  onApproveCreator,
                  onRejectCreator,
                  activeAction,
                  activeRequestId,
                })}
              </TableBodyCell>
            ))}
          </RequestTableRow>
        ))}
      </tbody>
    </RequestsTable>
  );
}
