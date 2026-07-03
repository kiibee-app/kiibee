"use client";

import { useTranslation } from "react-i18next";
import { GenericModal } from "@/components/UI/Modals";
import { MonoText } from "@/components/UI/Monotext";
import SafeImage from "@/components/UI/SafeImage";
import { ShareIcon } from "@/assets/icons/shareIcon";
import COLORS from "@repo/ui/colors";
import { MODAL_ALIGN } from "@/utils/ui";
import { CARD_BRANDS } from "@/utils/Constants";
import { CARD_BRAND_LOGOS } from "@/types/cardTypes";
import { DASHBOARD_VIEWER_BILLINGS } from "@/utils/translationKeys";
import { useViewerBillingInvoice } from "@/hooks/useViewerBillingInvoice";
import useShare from "@/hooks/useShare";
import ShareModal from "@/components/UI/Modals/ShareModal";
import GenericLoader from "@/components/UI/GenericLoader";
import { LOADER_VARIANT } from "@/utils/ui";
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
import { resolveCardBrand } from "@/hooks/useViewerBillingHistory";

type InvoiceModalProps = {
  visible: boolean;
  billingId: string | null;
  onClose: () => void;
};

export default function InvoiceModal({
  visible,
  billingId,
  onClose,
}: InvoiceModalProps) {
  const { t } = useTranslation();
  const { share, shareUrl, showShareModal, setShowShareModal } = useShare();
  const { invoice, isLoading } = useViewerBillingInvoice(billingId ?? "");

  const { contentTitle, contentImage, creatorName } =
    invoice?.contentDetails ?? {};
  const paymentMethod = resolveCardBrand(invoice?.paymentMethod) ?? null;
  const cardNumber = invoice?.cardNumber ? invoice.cardNumber.slice(-3) : "";

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
      {isLoading || !invoice ? (
        <GenericLoader variant={LOADER_VARIANT.INLINE} />
      ) : (
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
                {t(
                  DASHBOARD_VIEWER_BILLINGS.billingHistory.tableHeaders.amount,
                )}
              </InvoiceLabel>
              <MonoText $use="Body_SemiBold">{invoice.amount}</MonoText>
            </InvoiceInfo>
          </InvoiceGrid>

          {paymentMethod && (
            <InvoiceInfo>
              <InvoiceLabel>
                {t(
                  DASHBOARD_VIEWER_BILLINGS.billingHistory.tableHeaders
                    .paymentMethod,
                )}
              </InvoiceLabel>
              <InvoicePaymentMethod>
                {paymentMethod && (
                  <InvoiceLogoWrap>
                    <SafeImage
                      src={CARD_BRAND_LOGOS[paymentMethod]}
                      alt={paymentMethod}
                      width={paymentMethod === CARD_BRANDS.VISA ? 31 : 21}
                      height={paymentMethod === CARD_BRANDS.VISA ? 10 : 16}
                    />
                  </InvoiceLogoWrap>
                )}
                {cardNumber && (
                  <MonoText $use="Body_SemiBold">**** {cardNumber}</MonoText>
                )}
              </InvoicePaymentMethod>
            </InvoiceInfo>
          )}

          {(contentTitle || contentImage || creatorName) && (
            <InvoiceInfo>
              <InvoiceLabel>
                {t(
                  DASHBOARD_VIEWER_BILLINGS.billingHistory.invoiceModal
                    .contentDetails,
                )}
              </InvoiceLabel>
              <InvoiceContentMeta>
                {contentImage && (
                  <InvoiceThumb>
                    <SafeImage
                      src={contentImage}
                      alt=""
                      fill
                      sizes="34px"
                      style={{ objectFit: "cover" }}
                    />
                  </InvoiceThumb>
                )}
                <InvoiceContentText>
                  {contentTitle && (
                    <MonoText $use="Body_SemiBold">{contentTitle}</MonoText>
                  )}
                  {creatorName && (
                    <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
                      {creatorName}
                    </MonoText>
                  )}
                </InvoiceContentText>
              </InvoiceContentMeta>
            </InvoiceInfo>
          )}

          <InvoiceShareButton type="button" onClick={share}>
            <ShareIcon width={16} height={16} />
            <MonoText $use="Body_Medium">
              {t(DASHBOARD_VIEWER_BILLINGS.billingHistory.invoiceModal.share)}
            </MonoText>
          </InvoiceShareButton>
        </InvoiceCard>
      )}

      <ShareModal
        visible={showShareModal}
        url={shareUrl}
        onClose={() => setShowShareModal(false)}
      />
    </GenericModal>
  );
}
