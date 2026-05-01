"use client";

import type { CreatorDetailFieldConfig } from "../types/creator-details-modal";
import type { CreatorRequestColumn } from "../types/creator-requests-table";
import { formatRequestedAt } from "./date";
import {
  CreatorCell,
  CreatorName,
  DescriptionText,
  MiniText,
  RowActionButton,
  RowActionGroup,
  StatusBadge,
  LinkText,
} from "../components/features/all-creators/AllCreators.styles";

export const creatorDetailFields: CreatorDetailFieldConfig[] = [
  { key: "id", label: "ID", renderValue: (creator) => creator.id },
  {
    key: "fullName",
    label: "Full Name",
    renderValue: (creator) => creator.fullName,
  },
  {
    key: "firstName",
    label: "First Name",
    renderValue: (creator) => creator.firstName,
  },
  {
    key: "lastName",
    label: "Last Name",
    renderValue: (creator) => creator.lastName,
  },
  { key: "email", label: "Email", renderValue: (creator) => creator.email },
  { key: "phone", label: "Phone", renderValue: (creator) => creator.phone },
  { key: "cvr", label: "CVR", renderValue: (creator) => creator.cvr },
  { key: "status", label: "Status", renderValue: (creator) => creator.status },
  {
    key: "address",
    label: "Address",
    renderValue: (creator) => creator.address,
  },
  { key: "city", label: "City", renderValue: (creator) => creator.city },
  {
    key: "postalCode",
    label: "Postal Code",
    renderValue: (creator) => creator.postalCode,
  },
  {
    key: "exampleWorkLinkField",
    label: "Example Work Link",
    renderValue: (creator) => (
      <LinkText href={creator.exampleWorkLink} target="_blank" rel="noreferrer">
        {creator.exampleWorkLink}
      </LinkText>
    ),
  },
  {
    key: "approvedUserId",
    label: "Approved User ID",
    renderValue: (creator) => creator.approvedUserId ?? "null",
  },
  {
    key: "isDeleted",
    label: "Is Deleted",
    renderValue: (creator) => String(creator.isDeleted),
  },
  {
    key: "deletedAt",
    label: "Deleted At",
    renderValue: (creator) => creator.deletedAt ?? "null",
  },
  {
    key: "createdAt",
    label: "Created At",
    renderValue: (creator) => creator.createdAt,
  },
  {
    key: "updatedAt",
    label: "Updated At",
    renderValue: (creator) => creator.updatedAt,
  },
  {
    key: "contentDescription",
    label: "Content Description",
    renderValue: (creator) => creator.contentDescription,
  },
];

export function getCreatorTableColumns(): CreatorRequestColumn[] {
  return [
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
      renderCell: (creator) => (
        <DescriptionText>{creator.contentDescription}</DescriptionText>
      ),
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
      renderCell: (creator, actions) => {
        const canApproveRequest = creator.status === "pending";
        const canRejectRequest =
          creator.status === "pending" || creator.status === "approved";
        const isApproving =
          actions.activeAction === "approve" &&
          actions.activeRequestId === creator.id;
        const isRejecting =
          actions.activeAction === "reject" &&
          actions.activeRequestId === creator.id;
        const isActionDisabled = isApproving || isRejecting;

        return (
          <RowActionGroup>
            {canApproveRequest ? (
              <RowActionButton
                $variant="approve"
                type="button"
                disabled={isActionDisabled}
                onClick={(event) => {
                  event.stopPropagation();
                  actions.onApproveCreator(creator);
                }}
              >
                {isApproving ? "Approving..." : "Approve"}
              </RowActionButton>
            ) : null}
            {canRejectRequest ? (
              <RowActionButton
                $variant="reject"
                type="button"
                disabled={isActionDisabled}
                onClick={(event) => {
                  event.stopPropagation();
                  actions.onRejectCreator(creator);
                }}
              >
                {isRejecting ? "Rejecting..." : "Reject"}
              </RowActionButton>
            ) : null}
          </RowActionGroup>
        );
      },
    },
  ];
}
