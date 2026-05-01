import type { ReactNode } from "react";
import type { CreatorRequest } from "./creator-request";

export interface CreatorRequestsTableProps {
  creators: CreatorRequest[];
  onSelectCreator: (creator: CreatorRequest) => void;
}

export interface CreatorRequestColumn {
  key: string;
  label: string;
  renderCell: (creator: CreatorRequest) => ReactNode;
}
