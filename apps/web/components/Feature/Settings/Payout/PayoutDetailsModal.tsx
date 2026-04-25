"use client";

import React from "react";
import { GenericModal } from "@/components/UI/Modals";
import { PayoutWrapper, Row, Divider, FooterNote } from "./styles";
import { payoutRows, payoutTotal } from "@/utils/payout";
import { MODAL_ALIGN } from "@/utils/ui";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function PayoutDetailsModal({ open, onClose }: Props) {
  return (
    <GenericModal
      visible={open}
      title="Payment details"
      textAlign={MODAL_ALIGN.START}
      confirmLabel={payoutTotal.value}
      cancelLabel="Cancel"
      onClose={onClose}
      onCancel={onClose}
      onConfirm={onClose}
      width="630px"
      buttonRow
      buttonAlign={MODAL_ALIGN.END}
    >
      <PayoutWrapper>
        {payoutRows.map((item) => (
          <Row key={item.label}>
            <MonoText $use="Body_SemiBold" color={COLORS.neutral.GRAY_400}>
              {item.label}
            </MonoText>
            <MonoText $use="Body_Regular">{item.value}</MonoText>
          </Row>
        ))}

        <Divider />

        <FooterNote>
          <MonoText $use="H4_SemiBold" color={COLORS.neutral.GRAY_400}>
            {payoutTotal.label}
          </MonoText>
          <MonoText $use="H4_Medium">{payoutTotal.value}</MonoText>
        </FooterNote>
      </PayoutWrapper>
    </GenericModal>
  );
}
