import type { CreatorRequest } from "./creator-request";

export interface CreatorRequestsTableProps {
  creators: CreatorRequest[];
  onSelectCreator: (creator: CreatorRequest) => void;
}
