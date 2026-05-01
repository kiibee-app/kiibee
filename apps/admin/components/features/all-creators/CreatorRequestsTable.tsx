"use client";

import type { CreatorRequestsTableProps } from "../../../types/creator-requests-table";
import {
  RequestTableRow,
  RequestsTable,
  TableBodyCell,
  TableHeaderCell,
} from "./AllCreators.styles";
import { creatorTableColumns } from "./creatorTableColumns";

export function CreatorRequestsTable({
  creators,
  onSelectCreator,
}: CreatorRequestsTableProps) {
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
                {column.renderCell(creator)}
              </TableBodyCell>
            ))}
          </RequestTableRow>
        ))}
      </tbody>
    </RequestsTable>
  );
}
