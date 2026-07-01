import React from "react";
import { useTranslation } from "react-i18next";
import { GenericModal } from "@/components/UI/Modals";
import {
  ModalContentWrapper,
  ModalDescription,
} from "@/components/Feature/ProfileLayout/shared/LatestUpload/styles";
import { MonoText } from "@/components/UI/Monotext";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";
import { MODAL_ALIGN } from "@/utils/ui";
import styled from "styled-components";

type LoginRequiredModalProps = {
  visible: boolean;
  onClose: () => void;
  onLogin: () => void;
  onCreateAccount: () => void;
};

const ButtonGroup = styled.div<{ $row?: boolean; $align?: string }>`
  display: flex;
  flex-direction: ${({ $row }) => ($row ? "row" : "column")};
  gap: 12px;
  justify-content: ${({ $align }) =>
    $align === MODAL_ALIGN.CENTER
      ? "center"
      : $align === MODAL_ALIGN.START
        ? "flex-start"
        : "flex-end"};
  margin-top: 24px;
`;

export default function LoginRequiredModal({
  visible,
  onClose,
  onLogin,
  onCreateAccount,
}: LoginRequiredModalProps) {
  const { t } = useTranslation();

  return (
    <GenericModal
      visible={visible}
      onClose={onClose}
      size="sm"
      spacing="start"
      showCloseButton
    >
      <ModalContentWrapper>
        <MonoText $use="Heading3">
          {t("createProfileHome.latestUpload.loginModal.title")}
        </MonoText>
        <ModalDescription $use="Body_Medium">
          {t("createProfileHome.latestUpload.loginModal.message")}
        </ModalDescription>

        <ButtonGroup $row={true} $align={MODAL_ALIGN.CENTER}>
          <GenericButton variant={VARIANT.PRIMARY} onClick={onLogin}>
            {t("createProfileHome.latestUpload.loginModal.cancelLabel")}
          </GenericButton>
          <GenericButton variant={VARIANT.SECONDARY} onClick={onCreateAccount}>
            {t("createProfileHome.latestUpload.loginModal.confirmLabel")}
          </GenericButton>
        </ButtonGroup>
      </ModalContentWrapper>
    </GenericModal>
  );
}
