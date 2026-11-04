"use client";

import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { apiClient } from "../../../hooks/api/api-client";
import { MODAL_SIZE } from "../../../utils/constants";
import { FormInput } from "./EditCreatorProfileModal.styles";
import { Modal } from "../../common/Modal";
import {
  ModalActions,
  ModalCancelButton,
  ModalConfirmButton,
  ModalDescription,
  ModalField,
  ModalFieldLabel,
} from "./Creators.styles";

type Props = {
  contentId: string;
  contentTitle: string;
  onClose: () => void;
};

export function CreateContentCouponModal({
  contentId,
  contentTitle,
  onClose,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const fields = new FormData(event.currentTarget);
    const code = String(fields.get("code")).trim().toUpperCase();
    if (!code) {
      toast.error("Enter a coupon code");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiClient(
        `/coupons/admin/content/${encodeURIComponent(contentId)}`,
        {
          method: "POST",
          body: JSON.stringify({
            code,
            percentage: Number(fields.get("percentage")),
            validFrom: new Date(
              `${fields.get("validFrom")}T00:00:00.000`,
            ).toISOString(),
            validUntil: new Date(
              `${fields.get("validUntil")}T23:59:59.999`,
            ).toISOString(),
          }),
        },
      );
      if (!response.success) {
        throw new Error(response.message || "Could not create coupon");
      }
      toast.success(`Coupon ${code} created`);
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not create coupon",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      title="Create content coupon"
      open
      onClose={() => {
        if (!isSubmitting) onClose();
      }}
      size={MODAL_SIZE.SM}
    >
      <ModalDescription>
        This code applies to {contentTitle}. Dates use your device’s time zone.
      </ModalDescription>
      <form onSubmit={handleSubmit}>
        <ModalField>
          <ModalFieldLabel htmlFor="content-coupon-code">
            Coupon code
          </ModalFieldLabel>
          <FormInput
            id="content-coupon-code"
            name="code"
            maxLength={50}
            required
            disabled={isSubmitting}
          />
        </ModalField>
        <ModalField>
          <ModalFieldLabel htmlFor="content-coupon-percentage">
            Discount (%)
          </ModalFieldLabel>
          <FormInput
            id="content-coupon-percentage"
            name="percentage"
            type="number"
            min={1}
            max={100}
            required
            disabled={isSubmitting}
          />
        </ModalField>
        <ModalField>
          <ModalFieldLabel htmlFor="content-coupon-start">
            Start date
          </ModalFieldLabel>
          <FormInput
            id="content-coupon-start"
            name="validFrom"
            type="date"
            required
            disabled={isSubmitting}
          />
        </ModalField>
        <ModalField>
          <ModalFieldLabel htmlFor="content-coupon-end">
            End date
          </ModalFieldLabel>
          <FormInput
            id="content-coupon-end"
            name="validUntil"
            type="date"
            required
            disabled={isSubmitting}
          />
        </ModalField>
        <ModalActions>
          <ModalCancelButton
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </ModalCancelButton>
          <ModalConfirmButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating…" : "Create coupon"}
          </ModalConfirmButton>
        </ModalActions>
      </form>
    </Modal>
  );
}
