"use client";

import type { Viewer } from "../../../types/viewer";
import { formatRequestedAt } from "../../../utils/date";
import {
  formatViewerStatus,
  getViewerDisplayName,
  getViewerInitials,
  viewerLabels,
  viewerTableColumns,
} from "../../../utils/viewersConfig";
import {
  AccountStatusBadge,
  CreatorAvatar,
  CreatorAvatarImage,
  CreatorCell,
  CreatorIdentity,
  CreatorName,
  MetricGroup,
  MiniText,
  PublicationBadge,
  RequestsTable,
  RequestTableRow,
  TableBodyCell,
  TableHeaderCell,
  TableScrollWrapper,
} from "./AllCreators.styles";

type ViewersTableProps = {
  viewers: Viewer[];
};

export function ViewersTable({ viewers }: ViewersTableProps) {
  return (
    <TableScrollWrapper>
      <RequestsTable>
        <thead>
          <tr>
            {viewerTableColumns.map((column) => (
              <TableHeaderCell key={column}>{column}</TableHeaderCell>
            ))}
          </tr>
        </thead>
        <tbody>
          {viewers.map((viewer) => {
            const displayName = getViewerDisplayName(viewer);

            return (
              <RequestTableRow key={viewer.id}>
                <TableBodyCell>
                  <CreatorIdentity>
                    <CreatorAvatar>
                      {viewer.avatarUrl ? (
                        <CreatorAvatarImage
                          src={viewer.avatarUrl}
                          alt={displayName}
                        />
                      ) : (
                        getViewerInitials(displayName)
                      )}
                    </CreatorAvatar>
                    <CreatorCell>
                      <CreatorName>{displayName}</CreatorName>
                      <MiniText>{viewer.email}</MiniText>
                    </CreatorCell>
                  </CreatorIdentity>
                </TableBodyCell>
                <TableBodyCell>
                  {formatRequestedAt(viewer.createdAt)}
                </TableBodyCell>
                <TableBodyCell>
                  {viewer.city || viewerLabels.notProvided}
                </TableBodyCell>
                <TableBodyCell>
                  <MetricGroup>
                    <MiniText>
                      {viewer.purchaseCount} {viewerLabels.purchases}
                    </MiniText>
                    <MiniText>
                      {viewer.rentalCount} {viewerLabels.rentals}
                    </MiniText>
                  </MetricGroup>
                </TableBodyCell>
                <TableBodyCell>
                  <AccountStatusBadge $status={viewer.status}>
                    {formatViewerStatus(viewer.status)}
                  </AccountStatusBadge>
                </TableBodyCell>
                <TableBodyCell>
                  <PublicationBadge $published={viewer.isEmailVerified}>
                    {viewer.isEmailVerified
                      ? viewerLabels.verified
                      : viewerLabels.unverified}
                  </PublicationBadge>
                </TableBodyCell>
              </RequestTableRow>
            );
          })}
        </tbody>
      </RequestsTable>
    </TableScrollWrapper>
  );
}
