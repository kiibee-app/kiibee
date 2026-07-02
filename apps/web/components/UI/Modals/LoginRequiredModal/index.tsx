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
import LoginForm from "@/components/Feature/Auth/Login/LoginForm";
import SignUpViewer from "@/components/Feature/Auth/SignUpViewer";
import ViewerPreference from "@/components/Feature/Auth/SignUpViewer/viewersPreference";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { ButtonGroup } from "./styles";

type LoginRequiredModalProps = {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const VIEW_STATES = {
  INITIAL: "initial",
  LOGIN: "login",
  REGISTER: "register",
  PREFERENCES: "preferences",
} as const;

type ViewState = (typeof VIEW_STATES)[keyof typeof VIEW_STATES];

const INTENT_PURCHASE = "purchase";

export default function LoginRequiredModal({
  visible,
  onClose,
  onSuccess,
}: LoginRequiredModalProps) {
  const { t } = useTranslation();
  const [view, setView] = useState<ViewState>(VIEW_STATES.INITIAL);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!visible) {
      setTimeout(() => setView(VIEW_STATES.INITIAL), 300);
    }
  }, [visible]);

  const handleSuccess = () => {
    onClose();
    onSuccess
      ? onSuccess()
      : searchParams?.get("intent") === INTENT_PURCHASE
        ? router.refresh()
        : router.refresh();
  };

  return (
    <GenericModal
      visible={visible}
      onClose={onClose}
      size="sm"
      spacing="start"
      showCloseButton
      maxHeight="85vh"
    >
      {view === VIEW_STATES.INITIAL && (
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
              onClick={() => setView(VIEW_STATES.LOGIN)}
            >
              {t("createProfileHome.latestUpload.loginModal.cancelLabel")}
            </GenericButton>
            <GenericButton
              variant={VARIANT.PRIMARY}
              onClick={() => setView(VIEW_STATES.REGISTER)}
            >
              {t("createProfileHome.latestUpload.loginModal.confirmLabel")}
            </GenericButton>
          </ButtonGroup>
        </ModalContentWrapper>
      )}

      {view === VIEW_STATES.LOGIN && (
        <LoginForm
          onSuccess={handleSuccess}
          onSwitchMode={() => setView(VIEW_STATES.REGISTER)}
        />
      )}

      {view === VIEW_STATES.REGISTER && (
        <SignUpViewer
          onSuccess={() => setView(VIEW_STATES.PREFERENCES)}
          onSwitchMode={() => setView(VIEW_STATES.LOGIN)}
        />
      )}
      {view === VIEW_STATES.PREFERENCES && (
        <ViewerPreference
          onComplete={handleSuccess}
          onBack={() => setView(VIEW_STATES.REGISTER)}
        />
      )}
    </GenericModal>
  );
}
