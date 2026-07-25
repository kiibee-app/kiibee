import type { DeletionRequestsTab } from "../types/creator-deletion-request";

export const deletionRequestsTabs: Array<{
  key: DeletionRequestsTab;
  label: string;
}> = [
  { key: "requests", label: "Delete Requests" },
  { key: "history", label: "Delete History" },
];
