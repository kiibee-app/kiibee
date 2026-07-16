"use client";

import toast from "react-hot-toast";
import type { CreatorDeletionRequest } from "../../../types/creator-deletion-request";
import { useCreatorDeletionRequestAction } from "../../../hooks/api";
import type { CreatorDeletionRequestAction } from "../../../types/deletion-requests-table";

type UseDeletionRequestActionsOptions = {
  onRequestUpdated: (request: CreatorDeletionRequest) => CreatorDeletionRequest;
};

export function useDeletionRequestActions({
  onRequestUpdated,
}: UseDeletionRequestActionsOptions) {
  const approveRequestMutation = useCreatorDeletionRequestAction("approve");
  const rejectRequestMutation = useCreatorDeletionRequestAction("reject");

  const activeAction: CreatorDeletionRequestAction | null =
    approveRequestMutation.isPending
      ? "approve"
      : rejectRequestMutation.isPending
        ? "reject"
        : null;

  const activeRequestId =
    approveRequestMutation.variables?.requestId ??
    rejectRequestMutation.variables?.requestId ??
    null;

  const handleApproveRequest = (request: CreatorDeletionRequest) => {
    approveRequestMutation.mutate(
      { requestId: request.id },
      {
        onSuccess: () => {
          onRequestUpdated({
            ...request,
            status: "approved",
          });

          toast.success("Deletion request approved successfully");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to approve deletion request");
        },
      },
    );
  };

  const handleRejectRequest = (request: CreatorDeletionRequest) => {
    rejectRequestMutation.mutate(
      { requestId: request.id },
      {
        onSuccess: () => {
          onRequestUpdated({
            ...request,
            status: "rejected",
          });

          toast.success("Deletion request rejected successfully");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to reject deletion request");
        },
      },
    );
  };

  return {
    activeAction,
    activeRequestId,
    handleApproveRequest,
    handleRejectRequest,
  };
}
