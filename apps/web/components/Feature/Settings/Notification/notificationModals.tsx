import React from "react";
import { useTranslation } from "react-i18next";
import { GenericModal } from "@/components/UI/Modals";
import ConfirmationModal from "@/components/UI/ConfirmationModal";
import { NOTIFICATION_MODAL, NotificationModalType } from "@/utils/ui";
import SuccessModalIcon from "@/components/UI/Modals/SuccessModalIcon";

type NotificationModalsProps = {
  modalType: NotificationModalType;
  onClose: () => void;
  onConfirmDiscard: () => Promise<void> | void;
};

export default function NotificationModals({
  modalType,
  onClose,
  onConfirmDiscard,
}: NotificationModalsProps) {
  const { t } = useTranslation();

  if (modalType === NOTIFICATION_MODAL.SUCCESS) {
    return (
      <GenericModal
        visible={true}
        icon={<SuccessModalIcon />}
        iconMargin="0 auto 8px"
        title={t("settings.notifications.successModal.title")}
        message={t("settings.notifications.successModal.message")}
        confirmLabel={t("settings.notifications.successModal.done")}
        onClose={onClose}
        onConfirm={onClose}
        size="sm"
        showCloseButton={false}
      />
    );
  }

  return (
    <ConfirmationModal
      isOpen={modalType === NOTIFICATION_MODAL.DISCARD}
      onClose={onClose}
      title={t("settings.notifications.discardModal.title")}
      body={t("settings.notifications.discardModal.message")}
      cancelLabel={t("settings.notifications.discardModal.goBack")}
      confirmLabel={t("settings.notifications.discardModal.discard")}
      onConfirm={onConfirmDiscard}
      size="sm"
      spacing="xs"
      fullWidthButtons
      buttonRow
      showCloseButton={false}
    />
  );
}
