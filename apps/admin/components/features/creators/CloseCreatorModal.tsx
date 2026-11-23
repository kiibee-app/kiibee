"use client";

import { useState } from "react";
import { Modal } from "../../common/Modal";
import { MODAL_SIZE } from "../../../utils/constants";
import {
  ModalActions,
  ModalCancelButton,
  ModalConfirmButton,
  ModalDescription,
} from "./Creators.styles";
import { PricingField, PricingInput } from "./MakeContentFreeModal.styles";

type Props = {
  open: boolean;
  email: string;
  isSubmitting: boolean;
  error?: string;
  onClose: () => void;
  onConfirm: () => void;
};

export function CloseCreatorModal({
  open,
  email,
  isSubmitting,
  error,
  onClose,
  onConfirm,
}: Props) {
  const [confirmation, setConfirmation] = useState("");
  const handleClose = () => {
    if (isSubmitting) return;
    setConfirmation("");
    onClose();
  };
  return (
    <Modal
      title="Close creator account"
      open={open}
      onClose={handleClose}
      size={MODAL_SIZE.SM}
    >
      <ModalDescription>
        Permanently close {email} due to inactivity? The creator will lose
        access, their public profile will be removed, and their subscription
        will be cancelled. They can create a new account using the same email
        address. This account cannot be reopened. Existing payment and order
        records are retained. An account closure email will be sent in Danish.
      </ModalDescription>
      <PricingField>
        Type {email} to confirm
        <PricingInput
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          disabled={isSubmitting}
          autoComplete="off"
        />
      </PricingField>
      {error && <p role="alert">{error}</p>}
      <ModalActions>
        <ModalCancelButton
          type="button"
          onClick={handleClose}
          disabled={isSubmitting}
        >
          Cancel
        </ModalCancelButton>
        <ModalConfirmButton
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting || confirmation.trim() !== email}
        >
          {isSubmitting ? "Closing…" : "Close account"}
        </ModalConfirmButton>
      </ModalActions>
    </Modal>
  );
}
