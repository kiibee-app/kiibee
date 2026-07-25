"use client";

import type { CreatorDeletionRequest } from "../../../types/creator-deletion-request";
import {
  RequestsTable,
  TableBodyCell,
  TableHeaderCell,
  TableScrollWrapper,
} from "../all-creators/AllCreators.styles";
import { creatorDeletionHistoryColumns } from "../../../utils/deletionRequestsConfig";

type DeletionHistoryTableProps = {
  requests: CreatorDeletionRequest[];
};

export function DeletionHistoryTable({ requests }: DeletionHistoryTableProps) {
  return (
    <TableScrollWrapper>
      <RequestsTable>
        <thead>
          <tr>
            {creatorDeletionHistoryColumns.map((column) => (
              <TableHeaderCell key={column.key}>{column.label}</TableHeaderCell>
            ))}
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              {creatorDeletionHistoryColumns.map((column) => (
                <TableBodyCell key={`${request.id}-${column.key}`}>
                  {column.renderCell(request)}
                </TableBodyCell>
              ))}
            </tr>
          ))}
        </tbody>
      </RequestsTable>
    </TableScrollWrapper>
  );
}
