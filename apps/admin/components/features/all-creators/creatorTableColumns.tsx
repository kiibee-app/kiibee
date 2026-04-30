"use client";

import type { CreatorRequestColumn } from "../../../types/creator-requests-table";
import { formatRequestedAt } from "../../../utils/date";
import {
  CreatorCell,
  CreatorName,
  MiniText,
  RowActionButton,
  RowActionGroup,
  StatusBadge,
} from "./AllCreators.styles";

export const creatorTableColumns: CreatorRequestColumn[] = [
  {
    key: "creator",
    label: "Creator",
    renderCell: (creator) => (
      <CreatorCell>
        <CreatorName>{creator.fullName}</CreatorName>
        <MiniText>@{creator.city}</MiniText>
      </CreatorCell>
    ),
  },
  {
    key: "email",
    label: "Email",
    renderCell: (creator) => creator.email,
  },
  {
    key: "requestedAt",
    label: "Requested At",
    renderCell: (creator) => formatRequestedAt(creator.createdAt),
  },
  {
    key: "city",
    label: "City",
    renderCell: (creator) => creator.city,
  },
  {
    key: "contentDescription",
    label: "Content Description",
    renderCell: (creator) => creator.contentDescription,
  },
  {
    key: "status",
    label: "Status",
    renderCell: (creator) => (
      <StatusBadge $status={creator.status}>{creator.status}</StatusBadge>
    ),
  },
  {
    key: "actions",
    label: "Actions",
    renderCell: (creator) => {
      const canApproveRequest = creator.status === "pending";
      const canRejectRequest =
        creator.status === "pending" || creator.status === "approved";

      return (
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
      );
    },
  },
];
