import type { ReactNode } from "react";
import type { CreatorRequest } from "./creator-request";

export interface CreatorRequestsTableProps {
  creators: CreatorRequest[];
  onSelectCreator: (creator: CreatorRequest) => void;
  onApproveCreator: (creator: CreatorRequest) => void;
  onRejectCreator: (creator: CreatorRequest) => void;
  activeAction: CreatorRequestAction | null;
  activeRequestId: string | null;
}

export interface CreatorRequestColumn {
  key: string;
  label: string;
  renderCell: (
    creator: CreatorRequest,
    actionConfig: CreatorRequestActionConfig,
  ) => ReactNode;
}

export type CreatorRequestAction = "approve" | "reject";

export interface CreatorRequestActionConfig {
  activeAction: CreatorRequestAction | null;
  activeRequestId: string | null;
  onApproveCreator: (creator: CreatorRequest) => void;
  onRejectCreator: (creator: CreatorRequest) => void;
}
