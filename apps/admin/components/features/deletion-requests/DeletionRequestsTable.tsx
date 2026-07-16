"use client";

import type { DeletionRequestsTableProps } from "../../../types/deletion-requests-table";
import {
  RequestsTable,
  TableBodyCell,
  TableHeaderCell,
  TableScrollWrapper,
} from "../all-creators/AllCreators.styles";
import { creatorDeletionRequestColumns } from "../../../utils/deletionRequestsConfig";

export function DeletionRequestsTable({
  requests,
  onApproveRequest,
  onRejectRequest,
  activeAction,
  activeRequestId,
}: DeletionRequestsTableProps) {
  return (
    <TableScrollWrapper>
      <RequestsTable>
        <thead>
          <tr>
            {creatorDeletionRequestColumns.map((column) => (
              <TableHeaderCell key={column.key}>{column.label}</TableHeaderCell>
            ))}
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              {creatorDeletionRequestColumns.map((column) => (
                <TableBodyCell key={`${request.id}-${column.key}`}>
                  {column.renderCell(request, {
                    onApproveRequest,
                    onRejectRequest,
                    activeAction,
                    activeRequestId,
                  })}
                </TableBodyCell>
              ))}
            </tr>
          ))}
        </tbody>
      </RequestsTable>
    </TableScrollWrapper>
  );
}
