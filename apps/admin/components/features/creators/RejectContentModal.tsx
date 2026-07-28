"use client";

import { useState } from "react";
import { Modal } from "../../common/Modal";
import { creatorContentEngagementLabels } from "../../../utils/contentConfig";
import {
  ModalActions,
  ModalCancelButton,
  ModalConfirmButton,
  ModalDescription,
  ModalField,
  ModalFieldLabel,
  ModalTextArea,
} from "./Creators.styles";

type RejectContentModalProps = {
  open: boolean;
  contentTitle: string;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

export function RejectContentModal({
  open,
  contentTitle,
  isSubmitting,
  onClose,
  onConfirm,
}: RejectContentModalProps) {
  const [reason, setReason] = useState("");
  const trimmedReason = reason.trim();
  const canSubmit = trimmedReason.length > 0 && !isSubmitting;

  const handleClose = () => {
    if (isSubmitting) return;
    setReason("");
    onClose();
  };

  const handleConfirm = () => {
    if (!canSubmit) return;
    onConfirm(trimmedReason);
  };

  return (
    <Modal
      title={creatorContentEngagementLabels.rejectModalTitle}
      open={open}
      onClose={handleClose}
      size="sm"
    >
      <ModalDescription>
        {creatorContentEngagementLabels.rejectModalDescription(contentTitle)}
      </ModalDescription>

      <ModalField>
        <ModalFieldLabel htmlFor="reject-content-reason">
          {creatorContentEngagementLabels.rejectReasonLabel}
        </ModalFieldLabel>
        <ModalTextArea
          id="reject-content-reason"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder={creatorContentEngagementLabels.rejectReasonPlaceholder}
          disabled={isSubmitting}
          rows={4}
        />
      </ModalField>

      <ModalActions>
        <ModalCancelButton
          type="button"
          onClick={handleClose}
          disabled={isSubmitting}
        >
          {creatorContentEngagementLabels.rejectCancel}
        </ModalCancelButton>
        <ModalConfirmButton
          type="button"
          onClick={handleConfirm}
          disabled={!canSubmit}
        >
          {isSubmitting
            ? creatorContentEngagementLabels.rejecting
            : creatorContentEngagementLabels.rejectConfirm}
        </ModalConfirmButton>
      </ModalActions>
    </Modal>
  );
}
