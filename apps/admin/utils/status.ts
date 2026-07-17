import type { CreatorStatus } from "../types/creator-request";

export const toCreatorStatus = (status: string): CreatorStatus => {
  if (status === "approved" || status === "rejected") {
    return status;
  }

  return "pending";
};
