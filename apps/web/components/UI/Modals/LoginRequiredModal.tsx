import React, { useState, useEffect } from "react";
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
import LoginForm from "@/components/Feature/Auth/Login/LoginForm";
import SignUpViewer from "@/components/Feature/Auth/SignUpViewer";
import ViewerPreference from "@/components/Feature/Auth/SignUpViewer/viewersPreference";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

type LoginRequiredModalProps = {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
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
  onSuccess,
}: LoginRequiredModalProps) {
  const { t } = useTranslation();
  const [view, setView] = useState<
    "initial" | "login" | "register" | "preferences"
  >("initial");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!visible) {
      setTimeout(() => setView("initial"), 300);
    }
  }, [visible]);

  const handleSuccess = () => {
    onClose();
    if (onSuccess) {
      onSuccess();
    } else if (searchParams?.get("intent") === "purchase") {
      router.refresh();
    } else {
      router.refresh();
    }
  };

  return (
    <GenericModal
      visible={visible}
      onClose={onClose}
      size={view === "initial" ? "sm" : "md"}
      spacing="start"
      showCloseButton
    >
      {view === "initial" && (
        <ModalContentWrapper>
          <MonoText $use="Heading3">
            {t("createProfileHome.latestUpload.loginModal.title")}
          </MonoText>
          <ModalDescription $use="Body_Medium">
            {t("createProfileHome.latestUpload.loginModal.message")}
          </ModalDescription>

          <ButtonGroup $row={true} $align={MODAL_ALIGN.CENTER}>
            <GenericButton
              variant={VARIANT.PRIMARY}
              onClick={() => setView("login")}
            >
              {t("createProfileHome.latestUpload.loginModal.cancelLabel")}
            </GenericButton>
            <GenericButton
              variant={VARIANT.PRIMARY}
              onClick={() => setView("register")}
            >
              {t("createProfileHome.latestUpload.loginModal.confirmLabel")}
            </GenericButton>
          </ButtonGroup>
        </ModalContentWrapper>
      )}

      {view === "login" && (
        <LoginForm
          onSuccess={handleSuccess}
          onSwitchMode={() => setView("register")}
        />
      )}

      {view === "register" && (
        <SignUpViewer
          onSuccess={() => setView("preferences")}
          onSwitchMode={() => setView("login")}
        />
      )}
      {view === "preferences" && (
        <ViewerPreference
          onComplete={handleSuccess}
          onBack={() => setView("register")}
        />
      )}
    </GenericModal>
  );
}
