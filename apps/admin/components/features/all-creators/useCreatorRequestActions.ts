"use client";

import toast from "react-hot-toast";
import type { CreatorRequest } from "../../../types/creator-request";
import { useApproveCreator, useRejectCreator } from "../../../hooks/api";
import type { CreatorRequestAction } from "../../../types/creator-requests-table";

type UseCreatorRequestActionsOptions = {
  onCreatorUpdated: (creator: CreatorRequest) => CreatorRequest;
};

export function useCreatorRequestActions({
  onCreatorUpdated,
}: UseCreatorRequestActionsOptions) {
  const approveCreatorMutation = useApproveCreator();
  const rejectCreatorMutation = useRejectCreator();

  const activeAction: CreatorRequestAction | null =
    approveCreatorMutation.isPending
      ? "approve"
      : rejectCreatorMutation.isPending
        ? "reject"
        : null;

  const activeRequestId =
    approveCreatorMutation.variables?.requestId ??
    rejectCreatorMutation.variables?.requestId ??
    null;

  const handleApproveCreator = (
    creator: CreatorRequest,
    onSelectedCreatorUpdated: (creator: CreatorRequest) => void,
  ) => {
    approveCreatorMutation.mutate(
      { requestId: creator.id },
      {
        onSuccess: () => {
          const updatedCreator = onCreatorUpdated({
            ...creator,
            status: "approved",
          });

          onSelectedCreatorUpdated(updatedCreator);
          toast.success("Creator approved successfully");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to approve creator");
        },
      },
    );
  };

  const handleRejectCreator = (
    creator: CreatorRequest,
    onSelectedCreatorUpdated: (creator: CreatorRequest) => void,
  ) => {
    rejectCreatorMutation.mutate(
      { requestId: creator.id },
      {
        onSuccess: () => {
          const updatedCreator = onCreatorUpdated({
            ...creator,
            status: "rejected",
          });

          onSelectedCreatorUpdated(updatedCreator);
          toast.success("Creator rejected successfully");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to reject creator");
        },
      },
    );
  };

  return {
    activeAction,
    activeRequestId,
    handleApproveCreator,
    handleRejectCreator,
  };
}
