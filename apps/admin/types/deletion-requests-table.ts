import type { ReactNode } from "react";
import type { CreatorDeletionRequest } from "./creator-deletion-request";

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
    actionConfig: CreatorDeletionRequestActionConfig,
  ) => ReactNode;
}

export type CreatorDeletionRequestAction = "approve" | "reject";

export interface CreatorDeletionRequestActionConfig {
  activeAction: CreatorDeletionRequestAction | null;
  activeRequestId: string | null;
  onApproveRequest: (request: CreatorDeletionRequest) => void;
  onRejectRequest: (request: CreatorDeletionRequest) => void;
}
