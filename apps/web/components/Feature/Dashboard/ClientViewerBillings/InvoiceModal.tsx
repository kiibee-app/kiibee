"use client";

import { useTranslation } from "react-i18next";
import { GenericModal } from "@/components/UI/Modals";
import { MonoText } from "@/components/UI/Monotext";
import SafeImage from "@/components/UI/SafeImage";
import GenericButton from "@/components/UI/GenericButton";
import { ShareIcon } from "@/assets/icons/shareIcon";
import COLORS from "@repo/ui/colors";
import { CARD_BRANDS, VARIANT } from "@/utils/Constants";
import { MODAL_ALIGN } from "@/utils/ui";
import { DASHBOARD_VIEWER_BILLINGS } from "@/utils/translationKeys";
import {
  CARD_BRAND_LOGOS,
  type ViewerBillingHistoryItem,
} from "@/utils/dummyData/viewerBillingMockData";
import {
  InvoiceContentDetails,
  InvoiceContentMeta,
  InvoiceContentThumb,
  InvoiceDetailGrid,
  InvoiceField,
  InvoiceFields,
  InvoicePaymentMethod,
  InvoicePaymentLogo,
  InvoiceShareButton,
} from "./styles";

type Props = {
  visible: boolean;
  item: ViewerBillingHistoryItem | null;
  onClose: () => void;
};

export default function InvoiceModal({ visible, item, onClose }: Props) {
  const { t } = useTranslation();

  if (!item) return null;

  return (
    <GenericModal
      visible={visible}
      title={t(DASHBOARD_VIEWER_BILLINGS.invoiceModal.title)}
      onClose={onClose}
      size="lg"
      spacing="sm"
      textAlign={MODAL_ALIGN.START}
      contentMarginBottom="0"
      showCloseButton
    >
      <InvoiceFields>
        <InvoiceDetailGrid>
          <InvoiceField>
            <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY_400}>
              {t(DASHBOARD_VIEWER_BILLINGS.invoiceModal.orderNumber)}
            </MonoText>
            <MonoText $use="H5_Medium">01</MonoText>
          </InvoiceField>

          <InvoiceField>
            <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY_400}>
              {t(DASHBOARD_VIEWER_BILLINGS.invoiceModal.type)}
            </MonoText>
            <MonoText $use="H5_Medium">{item.type}</MonoText>
          </InvoiceField>

          <InvoiceField>
            <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY_400}>
              {t(DASHBOARD_VIEWER_BILLINGS.invoiceModal.paymentDate)}
            </MonoText>
            <MonoText $use="H5_Medium">{item.paymentDate}</MonoText>
          </InvoiceField>

          <InvoiceField>
            <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY_400}>
              {t(DASHBOARD_VIEWER_BILLINGS.invoiceModal.amount)}
            </MonoText>
            <MonoText $use="H5_Medium">{item.amount}</MonoText>
          </InvoiceField>
        </InvoiceDetailGrid>

        <InvoiceField>
          <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY_400}>
            {t(DASHBOARD_VIEWER_BILLINGS.invoiceModal.paymentMethod)}
          </MonoText>
          <InvoicePaymentMethod>
            <InvoicePaymentLogo>
              <SafeImage
                src={CARD_BRAND_LOGOS[item.paymentMethod.brand]}
                alt={item.paymentMethod.brand}
                width={item.paymentMethod.brand === CARD_BRANDS.VISA ? 31 : 21}
                height={item.paymentMethod.brand === CARD_BRANDS.VISA ? 10 : 16}
              />
            </InvoicePaymentLogo>
            <MonoText $use="H5_Medium">
              **** {item.paymentMethod.last4}
            </MonoText>
          </InvoicePaymentMethod>
        </InvoiceField>

        <InvoiceField>
          <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY_400}>
            {t(DASHBOARD_VIEWER_BILLINGS.invoiceModal.contentDetails)}
          </MonoText>
          <InvoiceContentDetails>
            <InvoiceContentThumb>
              <SafeImage
                src={item.contentImage}
                alt={item.contentTitle}
                fill
                sizes="44px"
                style={{ objectFit: "cover" }}
              />
            </InvoiceContentThumb>
            <InvoiceContentMeta>
              <MonoText $use="H5_Medium">{item.contentTitle}</MonoText>
              <MonoText $use="Body_Medium">{item.creatorName}</MonoText>
            </InvoiceContentMeta>
          </InvoiceContentDetails>
        </InvoiceField>

        <InvoiceShareButton>
          <GenericButton size="md" variant={VARIANT.PRIMARY_LITE}>
            <ShareIcon width={18} height={18} />
            {t(DASHBOARD_VIEWER_BILLINGS.invoiceModal.share)}
          </GenericButton>
        </InvoiceShareButton>
      </InvoiceFields>
    </GenericModal>
  );
}
