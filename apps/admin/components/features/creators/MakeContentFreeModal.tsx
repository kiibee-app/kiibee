"use client";

import { Modal } from "../../common/Modal";
import { MODAL_SIZE } from "../../../utils/constants";
import { creatorContentEngagementLabels } from "../../../utils/contentConfig";
import {
  ModalActions,
  ModalCancelButton,
  ModalConfirmButton,
  ModalDescription,
} from "./Creators.styles";

type MakeContentFreeModalProps = {
  open: boolean;
  contentTitle: string;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function MakeContentFreeModal({
  open,
  contentTitle,
  isSubmitting,
  onClose,
  onConfirm,
}: MakeContentFreeModalProps) {
  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  return (
    <Modal
      title={creatorContentEngagementLabels.makeFreeModalTitle}
      open={open}
      onClose={handleClose}
      size={MODAL_SIZE.SM}
    >
      <ModalDescription>
        {creatorContentEngagementLabels.makeFreeModalDescription(contentTitle)}
      </ModalDescription>

      <ModalActions>
        <ModalCancelButton
          type="button"
          onClick={handleClose}
          disabled={isSubmitting}
        >
          {creatorContentEngagementLabels.makeFreeCancel}
        </ModalCancelButton>
        <ModalConfirmButton
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? creatorContentEngagementLabels.makingFree
            : creatorContentEngagementLabels.makeFreeConfirm}
        </ModalConfirmButton>
      </ModalActions>
    </Modal>
  );
}
