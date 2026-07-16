"use client";

import type { CreatorDeletionRequestColumn } from "../types/deletion-requests-table";
import { formatRequestedAt } from "./date";
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
    renderCell: (request) => (
      <StatusBadge $status={request.status}>
        <StatusDot $status={request.status} />
        {request.status}
      </StatusBadge>
    ),
  },
  {
    key: "actions",
    label: "Actions",
    renderCell: (request, actions) => (
      <CreatorDeletionRequestActions request={request} actions={actions} />
    ),
  },
];
