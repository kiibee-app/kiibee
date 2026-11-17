"use client";

import { useState } from "react";
import { Modal } from "../../common/Modal";
import { MODAL_SIZE } from "../../../utils/constants";
import { creatorContentEngagementLabels } from "../../../utils/contentConfig";
import {
  ModalActions,
  ModalCancelButton,
  ModalDescription,
} from "./Creators.styles";

import {
  PricingDescription,
  PricingFields,
  PricingField,
  PricingInput,
  PricingHint,
  PricingConfirmButton,
} from "./MakeContentFreeModal.styles";

type MakeContentFreeModalProps = {
  open: boolean;
  makePaid?: boolean;
  contentTitle: string;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (paid?: {
    buyPrice?: number;
    rentPrice?: number;
    rentDurationHours?: number;
  }) => void;
};

export function MakeContentFreeModal({
  open,
  makePaid = false,
  contentTitle,
  isSubmitting,
  onClose,
  onConfirm,
}: MakeContentFreeModalProps) {
  const [buy, setBuy] = useState("");
  const [rent, setRent] = useState("");
  const validPrice = (value: string) =>
    Number.isFinite(Number(value)) &&
    Number(value) > 0 &&
    Number(value) <= 99999999.99 &&
    /^\d+(\.\d{1,2})?$/.test(value);
  const valid =
    (!buy || validPrice(buy)) &&
    (!rent || validPrice(rent)) &&
    Boolean(buy || rent);
  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  return (
    <Modal
      title={
        makePaid
          ? "Make content paid"
          : creatorContentEngagementLabels.makeFreeModalTitle
      }
      open={open}
      onClose={handleClose}
      size={MODAL_SIZE.SM}
    >
      {makePaid ? (
        <PricingDescription>
          Set buy or rental pricing for “{contentTitle}”. Existing purchases and
          rentals remain valid.
        </PricingDescription>
      ) : (
        <ModalDescription>
          {creatorContentEngagementLabels.makeFreeModalDescription(
            contentTitle,
          )}
        </ModalDescription>
      )}

      {makePaid && (
        <PricingFields>
          <PricingField>
            Buy price (DKK)
            <PricingInput
              disabled={isSubmitting}
              placeholder="e.g. 39.00"
              type="number"
              min="0.01"
              step="0.01"
              value={buy}
              onChange={(event) => setBuy(event.target.value)}
            />
          </PricingField>
          <PricingField>
            Rent price (DKK)
            <PricingInput
              disabled={isSubmitting}
              placeholder="e.g. 39.00"
              type="number"
              min="0.01"
              step="0.01"
              value={rent}
              onChange={(event) => setRent(event.target.value)}
            />
          </PricingField>
        </PricingFields>
      )}
      {makePaid && (
        <PricingHint>
          Enter a buy price, a rent price, or both. Leave unused pricing blank.
        </PricingHint>
      )}
      <ModalActions>
        <ModalCancelButton
          type="button"
          onClick={handleClose}
          disabled={isSubmitting}
        >
          {creatorContentEngagementLabels.makeFreeCancel}
        </ModalCancelButton>
        <PricingConfirmButton
          type="button"
          onClick={() =>
            onConfirm(
              makePaid
                ? {
                    ...(buy ? { buyPrice: Number(buy) } : {}),
                    ...(rent
                      ? {
                          rentPrice: Number(rent),
                          rentDurationHours: 48,
                        }
                      : {}),
                  }
                : undefined,
            )
          }
          disabled={isSubmitting || (makePaid && !valid)}
        >
          {isSubmitting
            ? creatorContentEngagementLabels.makingFree
            : makePaid
              ? "Make paid"
              : creatorContentEngagementLabels.makeFreeConfirm}
        </PricingConfirmButton>
      </ModalActions>
    </Modal>
  );
}
