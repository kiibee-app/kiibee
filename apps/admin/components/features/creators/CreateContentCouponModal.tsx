"use client";

import { useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
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

export type ContentCoupon = {
  id: string;
  code: string;
  percentage: string;
  validFrom: string | null;
  validUntil: string | null;
};

export const contentCouponKey = (contentId: string) => [
  "admin-content-coupons",
  contentId,
];
export const contentCouponPath = (contentId: string) =>
  `/coupons/admin/content/${encodeURIComponent(contentId)}`;

function dateInputValue(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

type Props = {
  coupon?: ContentCoupon;
  contentId: string;
  contentTitle: string;
  onClose: () => void;
};

export function CreateContentCouponModal({
  contentId,
  contentTitle,
  coupon,
  onClose,
}: Props) {
  const queryClient = useQueryClient();
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

    const startDate = String(fields.get("validFrom"));
    const endDate = String(fields.get("validUntil"));
    if (endDate < startDate) {
      toast.error("End date must be on or after the start date");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiClient(
        coupon
          ? `${contentCouponPath(contentId)}/${encodeURIComponent(coupon.id)}`
          : contentCouponPath(contentId),
        {
          method: coupon ? "PATCH" : "POST",
          body: JSON.stringify({
            code,
            percentage: Number(fields.get("percentage")),
            validFrom:
              coupon?.validFrom &&
              startDate === dateInputValue(coupon.validFrom)
                ? coupon.validFrom
                : new Date(`${startDate}T00:00:00.000`).toISOString(),
            validUntil:
              coupon?.validUntil &&
              endDate === dateInputValue(coupon.validUntil)
                ? coupon.validUntil
                : new Date(`${endDate}T23:59:59.999`).toISOString(),
          }),
        },
      );
      if (!response.success) {
        throw new Error(response.message || "Could not create coupon");
      }
      await queryClient.invalidateQueries({
        queryKey: contentCouponKey(contentId),
      });
      toast.success(coupon ? "Coupon updated" : `Coupon ${code} created`);
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
      title={coupon ? "Edit content coupon" : "Create content coupon"}
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
            defaultValue={coupon?.code}
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
            defaultValue={coupon?.percentage}
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
            defaultValue={dateInputValue(coupon?.validFrom)}
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
            defaultValue={dateInputValue(coupon?.validUntil)}
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
            {isSubmitting
              ? "Saving…"
              : coupon
                ? "Save changes"
                : "Create coupon"}
          </ModalConfirmButton>
        </ModalActions>
      </form>
    </Modal>
  );
}
