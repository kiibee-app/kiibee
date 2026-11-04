"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";
import styled from "styled-components";
import { apiClient } from "../../../hooks/api/api-client";
import { MODAL_SIZE } from "../../../utils/constants";
import { Modal } from "../../common/Modal";
import {
  DetailsSection,
  DetailsSectionBody,
  DetailsSectionHeader,
  DetailsSectionTitle,
} from "../viewers/Viewers.styles";
import {
  contentCouponKey,
  contentCouponPath,
  CreateContentCouponModal,
  type ContentCoupon,
} from "./CreateContentCouponModal";
import {
  ModalActions,
  ModalCancelButton,
  ModalConfirmButton,
  ModalDescription,
  PlayButton,
  RejectContentButton,
} from "./Creators.styles";

const CouponList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const CouponInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

const CouponNumber = styled.span`
  display: grid;
  place-items: center;
  flex: 0 0 32px;
  height: 32px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.neutral.PALE_GREEN};
  color: ${({ theme }) => theme.colors.secondary.main};
  font-size: 13px;
  font-weight: 700;
`;

const CouponSummary = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px 10px;
  overflow-wrap: anywhere;
`;

const CopyCodeButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 0;
  border-radius: 6px;
  padding: 4px 6px;
  background: transparent;
  color: inherit;
  font: inherit;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
  overflow-wrap: anywhere;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral.PALE_GREEN};
  }

  svg {
    flex-shrink: 0;
  }
`;

async function copyCouponCode(code: string) {
  try {
    await navigator.clipboard.writeText(code);
    toast.success("Coupon code copied");
  } catch {
    toast.error("Could not copy coupon code");
  }
}

const CouponDiscount = styled.span`
  padding: 3px 8px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.neutral.PALE_GREEN};
  font-size: 12px;
  font-weight: 700;
`;

const CouponDates = styled.div`
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.secondary.muted};
  font-size: 13px;
`;

const CouponRow = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px 0;

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.secondary.border};
  }
`;

const CouponActions = styled.div`
  display: flex;
  gap: 8px;
`;

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleDateString() : "—";
}

export function ContentCoupons({
  contentId,
  contentTitle,
}: {
  contentId: string;
  contentTitle: string;
}) {
  const [editing, setEditing] = useState<ContentCoupon | null>(null);
  const [deleting, setDeleting] = useState<ContentCoupon | null>(null);
  const queryClient = useQueryClient();
  const queryKey = contentCouponKey(contentId);
  const endpoint = contentCouponPath(contentId);
  const coupons = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await apiClient<ContentCoupon[]>(endpoint);
      if (!response.success)
        throw new Error(response.message || "Could not load coupons");
      return response.data ?? [];
    },
  });
  const remove = useMutation({
    mutationFn: async (coupon: ContentCoupon) => {
      const response = await apiClient(
        `${endpoint}/${encodeURIComponent(coupon.id)}`,
        {
          method: "DELETE",
        },
      );
      if (!response.success)
        throw new Error(response.message || "Could not delete coupon");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
      setDeleting(null);
      toast.success("Coupon deleted");
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <DetailsSection>
      <DetailsSectionHeader>
        <DetailsSectionTitle>Coupons</DetailsSectionTitle>
      </DetailsSectionHeader>
      <DetailsSectionBody>
        {coupons.isPending && <p>Loading coupons…</p>}
        {coupons.isError && <p role="alert">Could not load coupons.</p>}
        {coupons.data?.length === 0 && <p>No coupons yet.</p>}
        {!!coupons.data?.length && (
          <CouponList role="list">
            {coupons.data.map((coupon, index) => (
              <CouponRow key={coupon.id}>
                <CouponInfo>
                  <CouponNumber>{index + 1}</CouponNumber>
                  <div>
                    <CouponSummary>
                      <CopyCodeButton
                        type="button"
                        aria-label={`Copy coupon code ${coupon.code}`}
                        title="Copy coupon code"
                        onClick={() => void copyCouponCode(coupon.code)}
                      >
                        <span>{coupon.code}</span>
                        <Copy size={14} aria-hidden="true" />
                      </CopyCodeButton>
                      <CouponDiscount>
                        {Number(coupon.percentage)}% off
                      </CouponDiscount>
                    </CouponSummary>
                    <CouponDates>
                      {formatDate(coupon.validFrom)} –{" "}
                      {formatDate(coupon.validUntil)}
                    </CouponDates>
                  </div>
                </CouponInfo>
                <CouponActions>
                  <PlayButton type="button" onClick={() => setEditing(coupon)}>
                    Edit
                  </PlayButton>
                  <RejectContentButton
                    type="button"
                    onClick={() => setDeleting(coupon)}
                  >
                    Delete
                  </RejectContentButton>
                </CouponActions>
              </CouponRow>
            ))}
          </CouponList>
        )}
      </DetailsSectionBody>
      {editing && (
        <CreateContentCouponModal
          contentId={contentId}
          contentTitle={contentTitle}
          coupon={editing}
          onClose={() => setEditing(null)}
        />
      )}
      {deleting && (
        <Modal
          title="Delete coupon"
          open
          size={MODAL_SIZE.SM}
          onClose={() => {
            if (!remove.isPending) setDeleting(null);
          }}
        >
          <ModalDescription>
            {deleting.code} will no longer work at checkout.
          </ModalDescription>
          <ModalActions>
            <ModalCancelButton
              type="button"
              disabled={remove.isPending}
              onClick={() => setDeleting(null)}
            >
              Cancel
            </ModalCancelButton>
            <ModalConfirmButton
              type="button"
              disabled={remove.isPending}
              onClick={() => remove.mutate(deleting)}
            >
              {remove.isPending ? "Deleting…" : "Delete coupon"}
            </ModalConfirmButton>
          </ModalActions>
        </Modal>
      )}
    </DetailsSection>
  );
}
