"use client";

import type { CreatorRequestsTableProps } from "../../../types/creator-requests-table";
import { formatRequestedAt } from "../../../utils/date";
import {
  CreatorCell,
  CreatorName,
  MiniText,
  RequestTableRow,
  RequestsTable,
  RowActionButton,
  RowActionGroup,
  StatusBadge,
  TableBodyCell,
  TableHeaderCell,
} from "./AllCreators.styles";

export function CreatorRequestsTable({
  creators,
  onSelectCreator,
}: CreatorRequestsTableProps) {
  return (
    <RequestsTable>
      <thead>
        <tr>
          <TableHeaderCell>Creator</TableHeaderCell>
          <TableHeaderCell>Email</TableHeaderCell>
          <TableHeaderCell>Requested At</TableHeaderCell>
          <TableHeaderCell>City</TableHeaderCell>
          <TableHeaderCell>Content Description</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Actions</TableHeaderCell>
        </tr>
      </thead>
      <tbody>
        {creators.map((creator) => {
          const canApproveRequest = creator.status === "pending";
          const canRejectRequest =
            creator.status === "pending" || creator.status === "approved";

          return (
            <RequestTableRow
              key={creator.id}
              onClick={() => onSelectCreator(creator)}
            >
              <TableBodyCell>
                <CreatorCell>
                  <CreatorName>{creator.fullName}</CreatorName>
                  <MiniText>@{creator.city}</MiniText>
                </CreatorCell>
              </TableBodyCell>
              <TableBodyCell>{creator.email}</TableBodyCell>
              <TableBodyCell>
                {formatRequestedAt(creator.createdAt)}
              </TableBodyCell>
              <TableBodyCell>{creator.city}</TableBodyCell>
              <TableBodyCell>{creator.contentDescription}</TableBodyCell>
              <TableBodyCell>
                <StatusBadge $status={creator.status}>
                  {creator.status}
                </StatusBadge>
              </TableBodyCell>
              <TableBodyCell>
                <RowActionGroup>
                  {canApproveRequest ? (
                    <RowActionButton
                      $variant="approve"
                      type="button"
                      onClick={(event) => event.stopPropagation()}
                    >
                      Approve
                    </RowActionButton>
                  ) : null}
                  {canRejectRequest ? (
                    <RowActionButton
                      $variant="reject"
                      type="button"
                      onClick={(event) => event.stopPropagation()}
                    >
                      Reject
                    </RowActionButton>
                  ) : null}
                </RowActionGroup>
              </TableBodyCell>
            </RequestTableRow>
          );
        })}
      </tbody>
    </RequestsTable>
  );
}
