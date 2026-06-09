"use client";

import { useTranslation } from "react-i18next";
import { GenericModal } from "@/components/UI/Modals";
import { MonoText } from "@/components/UI/Monotext";
import SafeImage from "@/components/UI/SafeImage";
import { ShareIcon } from "@/assets/icons/shareIcon";
import COLORS from "@repo/ui/colors";
import { MODAL_ALIGN } from "@/utils/ui";
import { CARD_BRANDS } from "@/utils/Constants";
import {
  CARD_BRAND_LOGOS,
  type ViewerBillingHistoryItem,
} from "@/utils/dummyData/viewerBillingMockData";
import { DASHBOARD_VIEWER_BILLINGS } from "@/utils/translationKeys";
import {
  InvoiceCard,
  InvoiceContentMeta,
  InvoiceContentText,
  InvoiceGrid,
  InvoiceInfo,
  InvoiceLabel,
  InvoiceLogoWrap,
  InvoicePaymentMethod,
  InvoiceShareButton,
  InvoiceThumb,
} from "./styles";

type InvoiceModalProps = {
  visible: boolean;
  invoice: ViewerBillingHistoryItem | null;
  onClose: () => void;
};

export default function InvoiceModal({
  visible,
  invoice,
  onClose,
}: InvoiceModalProps) {
  const { t } = useTranslation();

  if (!invoice) return null;

  return (
    <GenericModal
      visible={visible}
      title={t(DASHBOARD_VIEWER_BILLINGS.billingHistory.invoiceModal.title)}
      onClose={onClose}
      size="md"
      spacing="start"
      textAlign={MODAL_ALIGN.START}
      contentMarginBottom="0"
    >
      <InvoiceCard>
        <InvoiceGrid>
          <InvoiceInfo>
            <InvoiceLabel>
              {t(
                DASHBOARD_VIEWER_BILLINGS.billingHistory.invoiceModal
                  .orderNumber,
              )}
            </InvoiceLabel>
            <MonoText $use="Body_SemiBold">{invoice.orderNumber}</MonoText>
          </InvoiceInfo>

          <InvoiceInfo>
            <InvoiceLabel>
              {t(DASHBOARD_VIEWER_BILLINGS.billingHistory.tableHeaders.type)}
            </InvoiceLabel>
            <MonoText $use="Body_SemiBold">{invoice.type}</MonoText>
          </InvoiceInfo>

          <InvoiceInfo>
            <InvoiceLabel>
              {t(
                DASHBOARD_VIEWER_BILLINGS.billingHistory.tableHeaders
                  .paymentDate,
              )}
            </InvoiceLabel>
            <MonoText $use="Body_SemiBold">{invoice.paymentDate}</MonoText>
          </InvoiceInfo>

          <InvoiceInfo>
            <InvoiceLabel>
              {t(DASHBOARD_VIEWER_BILLINGS.billingHistory.tableHeaders.amount)}
            </InvoiceLabel>
            <MonoText $use="Body_SemiBold">{invoice.amount}</MonoText>
          </InvoiceInfo>
        </InvoiceGrid>

        <InvoiceInfo>
          <InvoiceLabel>
            {t(
              DASHBOARD_VIEWER_BILLINGS.billingHistory.tableHeaders
                .paymentMethod,
            )}
          </InvoiceLabel>
          <InvoicePaymentMethod>
            <InvoiceLogoWrap>
              <SafeImage
                src={CARD_BRAND_LOGOS[invoice.paymentMethod.brand]}
                alt={invoice.paymentMethod.brand}
                width={
                  invoice.paymentMethod.brand === CARD_BRANDS.VISA ? 31 : 21
                }
                height={
                  invoice.paymentMethod.brand === CARD_BRANDS.VISA ? 10 : 16
                }
              />
            </InvoiceLogoWrap>
            <MonoText $use="Body_SemiBold">
              **** {invoice.paymentMethod.last4}
            </MonoText>
          </InvoicePaymentMethod>
        </InvoiceInfo>

        <InvoiceInfo>
          <InvoiceLabel>
            {t(
              DASHBOARD_VIEWER_BILLINGS.billingHistory.invoiceModal
                .contentDetails,
            )}
          </InvoiceLabel>
          <InvoiceContentMeta>
            <InvoiceThumb>
              <SafeImage
                src={invoice.contentImage}
                alt=""
                fill
                sizes="34px"
                style={{ objectFit: "cover" }}
              />
            </InvoiceThumb>
            <InvoiceContentText>
              <MonoText $use="Body_SemiBold">{invoice.contentTitle}</MonoText>
              <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
                {invoice.creatorName}
              </MonoText>
            </InvoiceContentText>
          </InvoiceContentMeta>
        </InvoiceInfo>

        <InvoiceShareButton type="button">
          <ShareIcon width={16} height={16} />
          <MonoText $use="Body_Medium">
            {t(DASHBOARD_VIEWER_BILLINGS.billingHistory.invoiceModal.share)}
          </MonoText>
        </InvoiceShareButton>
      </InvoiceCard>
    </GenericModal>
  );
}
