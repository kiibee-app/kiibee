"use client";

import type { CreatorDeletionRequest } from "../../../types/creator-deletion-request";
import {
  RequestsTable,
  RequestTableRow,
  TableBodyCell,
  TableHeaderCell,
  TableScrollWrapper,
} from "../all-creators/AllCreators.styles";
import { creatorDeletionHistoryColumns } from "../../../utils/deletionRequestsConfig";

type DeletionHistoryTableProps = {
  requests: CreatorDeletionRequest[];
  onSelectRequest: (request: CreatorDeletionRequest) => void;
};

export function DeletionHistoryTable({
  requests,
  onSelectRequest,
}: DeletionHistoryTableProps) {
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
            <RequestTableRow
              key={request.id}
              onClick={() => onSelectRequest(request)}
            >
              {creatorDeletionHistoryColumns.map((column) => (
                <TableBodyCell key={`${request.id}-${column.key}`}>
                  {column.renderCell(request)}
                </TableBodyCell>
              ))}
            </RequestTableRow>
          ))}
        </tbody>
      </RequestsTable>
    </TableScrollWrapper>
  );
}
