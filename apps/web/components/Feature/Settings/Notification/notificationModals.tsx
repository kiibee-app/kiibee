import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { GenericModal } from "@/components/UI/Modals";
import { NOTIFICATION_MODAL, NotificationModalType } from "@/utils/ui";
import SuccessModalIcon from "@/components/UI/Modals/SuccessModalIcon";

type NotificationModalsProps = {
  modalType: NotificationModalType;
  onClose: () => void;
  onConfirmDiscard: () => void;
};

export default function NotificationModals({
  modalType,
  onClose,
  onConfirmDiscard,
}: NotificationModalsProps) {
  const { t } = useTranslation();

  const modalProps = useMemo(() => {
    if (modalType === NOTIFICATION_MODAL.SUCCESS) {
      return {
        icon: <SuccessModalIcon />,
        iconMargin: "0 auto 8px",
        title: t("settings.notifications.successModal.title"),
        message: t("settings.notifications.successModal.message"),
        cancelLabel: undefined,
        confirmLabel: t("settings.notifications.successModal.done"),
        onConfirm: onClose,
        onCancel: undefined,
        padding: undefined,
        fullWidthButtons: undefined,
        buttonRow: undefined,
      };
    }

    return {
      icon: undefined,
      iconMargin: undefined,
      title: t("settings.notifications.discardModal.title"),
      message: t("settings.notifications.discardModal.message"),
      cancelLabel: t("settings.notifications.discardModal.goBack"),
      confirmLabel: t("settings.notifications.discardModal.discard"),
      onConfirm: onConfirmDiscard,
      onCancel: onClose,
      padding: "40px 30px",
      fullWidthButtons: true,
      buttonRow: true,
    };
  }, [modalType, onClose, onConfirmDiscard, t]);

  return (
    <GenericModal
      visible={Boolean(modalType)}
      icon={modalProps.icon}
      iconMargin={modalProps.iconMargin}
      title={modalProps.title}
      message={modalProps.message}
      cancelLabel={modalProps.cancelLabel}
      confirmLabel={modalProps.confirmLabel}
      onCancel={modalProps.onCancel}
      onClose={onClose}
      onConfirm={modalProps.onConfirm}
      size="sm"
      padding={modalProps.padding}
      fullWidthButtons={modalProps.fullWidthButtons}
      buttonRow={modalProps.buttonRow}
      showCloseButton={false}
    />
  );
}
