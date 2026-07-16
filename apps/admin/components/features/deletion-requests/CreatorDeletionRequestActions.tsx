"use client";

import type { MouseEvent } from "react";
import type { CreatorDeletionRequest } from "../../../types/creator-deletion-request";
import type { CreatorDeletionRequestActionConfig } from "../../../types/deletion-requests-table";
import { ACTION_ICONS } from "../../../utils/constants";
import {
  ActionIcon,
  RowActionButton,
  RowActionGroup,
} from "../all-creators/AllCreators.styles";

interface CreatorDeletionRequestActionsProps {
  request: CreatorDeletionRequest;
  actions: CreatorDeletionRequestActionConfig;
}

export function CreatorDeletionRequestActions({
  request,
  actions,
}: CreatorDeletionRequestActionsProps) {
  const { status, id } = request;
  const { activeAction, activeRequestId } = actions;

  const isPending = status === "pending";
  const isApproving = activeAction === "approve" && activeRequestId === id;
  const isRejecting = activeAction === "reject" && activeRequestId === id;
  const isActionDisabled = isApproving || isRejecting;

  const handleClick = (
    event: MouseEvent<HTMLButtonElement>,
    handler: (request: CreatorDeletionRequest) => void,
  ) => {
    event.stopPropagation();
    handler(request);
  };

  return (
    <RowActionGroup>
      {isPending ? (
        <RowActionButton
          $variant="approve"
          type="button"
          disabled={isActionDisabled}
          onClick={(event) => handleClick(event, actions.onApproveRequest)}
        >
          <ActionIcon $variant="approve">{ACTION_ICONS.APPROVE}</ActionIcon>
          {isApproving ? "Approving..." : "Approve"}
        </RowActionButton>
      ) : null}
      {isPending ? (
        <RowActionButton
          $variant="reject"
          type="button"
          disabled={isActionDisabled}
          onClick={(event) => handleClick(event, actions.onRejectRequest)}
        >
          <ActionIcon $variant="reject">{ACTION_ICONS.REJECT}</ActionIcon>
          {isRejecting ? "Rejecting..." : "Reject"}
        </RowActionButton>
      ) : null}
    </RowActionGroup>
  );
}
