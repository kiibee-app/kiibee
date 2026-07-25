import type { ReactNode } from "react";
import type { CreatorDeletionRequest } from "./creator-deletion-request";
import { CREATOR_DELETION_REQUEST_ACTION } from "../utils/constants";

export interface DeletionRequestsTableProps {
  requests: CreatorDeletionRequest[];
  onApproveRequest: (request: CreatorDeletionRequest) => void;
  onRejectRequest: (request: CreatorDeletionRequest) => void;
  activeAction: CreatorDeletionRequestAction | null;
  activeRequestId: string | null;
}

export interface CreatorDeletionRequestColumn {
  key: string;
  label: string;
  renderCell: (
    request: CreatorDeletionRequest,
    actionConfig?: CreatorDeletionRequestActionConfig,
  ) => ReactNode;
}

export type CreatorDeletionRequestAction =
  (typeof CREATOR_DELETION_REQUEST_ACTION)[keyof typeof CREATOR_DELETION_REQUEST_ACTION];

export interface CreatorDeletionRequestActionConfig {
  activeAction: CreatorDeletionRequestAction | null;
  activeRequestId: string | null;
  onApproveRequest: (request: CreatorDeletionRequest) => void;
  onRejectRequest: (request: CreatorDeletionRequest) => void;
}
