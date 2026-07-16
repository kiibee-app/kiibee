"use client";

import type { MouseEvent } from "react";
import type { CreatorDeletionRequest } from "../../../types/creator-deletion-request";
import type { CreatorDeletionRequestActionConfig } from "../../../types/deletion-requests-table";
import {
  ACTION_ICONS,
  CREATOR_DELETION_REQUEST_ACTION,
  CREATOR_DELETION_REQUEST_STATUS,
} from "../../../utils/constants";
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

  const isPending = status === CREATOR_DELETION_REQUEST_STATUS.PENDING;
  const isApproving =
    activeAction === CREATOR_DELETION_REQUEST_ACTION.APPROVE &&
    activeRequestId === id;
  const isRejecting =
    activeAction === CREATOR_DELETION_REQUEST_ACTION.REJECT &&
    activeRequestId === id;
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
          $variant={CREATOR_DELETION_REQUEST_ACTION.APPROVE}
          type="button"
          disabled={isActionDisabled}
          onClick={(event) => handleClick(event, actions.onApproveRequest)}
        >
          <ActionIcon $variant={CREATOR_DELETION_REQUEST_ACTION.APPROVE}>
            {ACTION_ICONS.APPROVE}
          </ActionIcon>
          {isApproving ? "Approving..." : "Approve"}
        </RowActionButton>
      ) : null}
      {isPending ? (
        <RowActionButton
          $variant={CREATOR_DELETION_REQUEST_ACTION.REJECT}
          type="button"
          disabled={isActionDisabled}
          onClick={(event) => handleClick(event, actions.onRejectRequest)}
        >
          <ActionIcon $variant={CREATOR_DELETION_REQUEST_ACTION.REJECT}>
            {ACTION_ICONS.REJECT}
          </ActionIcon>
          {isRejecting ? "Rejecting..." : "Reject"}
        </RowActionButton>
      ) : null}
    </RowActionGroup>
  );
}
