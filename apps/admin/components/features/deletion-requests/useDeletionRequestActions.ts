"use client";

import toast from "react-hot-toast";
import type { CreatorDeletionRequest } from "../../../types/creator-deletion-request";
import { useCreatorDeletionRequestAction } from "../../../hooks/api";
import type { CreatorDeletionRequestAction } from "../../../types/deletion-requests-table";
import {
  CREATOR_DELETION_REQUEST_ACTION,
  CREATOR_DELETION_REQUEST_STATUS,
} from "../../../utils/constants";

type UseDeletionRequestActionsOptions = {
  onRequestUpdated: (request: CreatorDeletionRequest) => CreatorDeletionRequest;
};

export function useDeletionRequestActions({
  onRequestUpdated,
}: UseDeletionRequestActionsOptions) {
  const approveRequestMutation = useCreatorDeletionRequestAction(
    CREATOR_DELETION_REQUEST_ACTION.APPROVE,
  );
  const rejectRequestMutation = useCreatorDeletionRequestAction(
    CREATOR_DELETION_REQUEST_ACTION.REJECT,
  );

  const activeAction: CreatorDeletionRequestAction | null =
    approveRequestMutation.isPending
      ? CREATOR_DELETION_REQUEST_ACTION.APPROVE
      : rejectRequestMutation.isPending
        ? CREATOR_DELETION_REQUEST_ACTION.REJECT
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
            status: CREATOR_DELETION_REQUEST_STATUS.APPROVED,
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
            status: CREATOR_DELETION_REQUEST_STATUS.REJECTED,
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
