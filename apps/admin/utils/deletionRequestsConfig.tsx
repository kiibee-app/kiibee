"use client";

import type { CreatorDeletionRequestColumn } from "../types/deletion-requests-table";
import { formatRequestedAt } from "./date";
import { toCreatorStatus } from "./status";
import { CreatorDeletionRequestActions } from "../components/features/deletion-requests/CreatorDeletionRequestActions";
import {
  CreatorCell,
  CreatorName,
  MiniText,
  StatusBadge,
  StatusDot,
} from "../components/features/all-creators/AllCreators.styles";

export const creatorDeletionRequestColumns: CreatorDeletionRequestColumn[] = [
  {
    key: "creator",
    label: "Creator",
    renderCell: (request) => (
      <CreatorCell>
        <CreatorName>{request.user.fullName}</CreatorName>
        <MiniText>@{request.user.role}</MiniText>
      </CreatorCell>
    ),
  },
  {
    key: "email",
    label: "Email",
    renderCell: (request) => request.user.email,
  },
  {
    key: "requestedAt",
    label: "Requested At",
    renderCell: (request) => formatRequestedAt(request.createdAt),
  },
  {
    key: "status",
    label: "Status",
    renderCell: (request) => {
      const status = toCreatorStatus(request.status);

      return (
        <StatusBadge $status={status}>
          <StatusDot $status={status} />
          {request.status}
        </StatusBadge>
      );
    },
  },
  {
    key: "actions",
    label: "Actions",
    renderCell: (request, actions) => (
      <CreatorDeletionRequestActions request={request} actions={actions!} />
    ),
  },
];

export const creatorDeletionHistoryColumns: CreatorDeletionRequestColumn[] = [
  {
    key: "creator",
    label: "Creator",
    renderCell: (request) => (
      <CreatorCell>
        <CreatorName>{request.user.fullName || "Unknown Creator"}</CreatorName>
        <MiniText>@{request.user.role || "creator"}</MiniText>
      </CreatorCell>
    ),
  },
  {
    key: "email",
    label: "Email",
    renderCell: (request) => request.user.email || "N/A",
  },
  {
    key: "requestedAt",
    label: "Requested At",
    renderCell: (request) => formatRequestedAt(request.createdAt),
  },
  {
    key: "processedAt",
    label: "Processed At",
    renderCell: (request) =>
      formatRequestedAt(request.user.deletedAt || request.updatedAt),
  },
  {
    key: "status",
    label: "Status",
    renderCell: (request) => {
      const status = toCreatorStatus(request.status);

      return (
        <StatusBadge $status={status}>
          <StatusDot $status={status} />
          {request.status}
        </StatusBadge>
      );
    },
  },
];
