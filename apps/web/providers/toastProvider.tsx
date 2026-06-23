"use client";

import { ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { GenericModal } from "@/components/UI/Modals";
import { MonoText } from "@/components/UI/Monotext";
import { MODAL_ALIGN } from "@/utils/ui";
import { PATHS, pathLoginWithNext } from "@/utils/path";
import {
  ModalContentWrapper,
  ModalDescription,
} from "@/components/Feature/SingleContentPage/styles";

export function ToastProvider() {
  const { t } = useTranslation();
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingRedirectUrl, setPendingRedirectUrl] = useState("");

  useEffect(() => {
    const handleOpenModal = (e: Event) => {
      e.preventDefault();
      const customEvent = e as CustomEvent<{ href: string }>;
      setPendingRedirectUrl(customEvent.detail.href);
      setShowLoginModal(true);
    };

    window.addEventListener("kiibee:open-login-modal", handleOpenModal);
    return () => {
      window.removeEventListener("kiibee:open-login-modal", handleOpenModal);
    };
  }, []);

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    if (pendingRedirectUrl) {
      router.push(pathLoginWithNext(pendingRedirectUrl));
    }
  };

  const handleSignupRedirect = () => {
    setShowLoginModal(false);
    if (pendingRedirectUrl) {
      const nextParam = encodeURIComponent(pendingRedirectUrl);
      router.push(`${PATHS.AUTH_SIGNUP}?next=${nextParam}`);
    } else {
      router.push(PATHS.AUTH_SIGNUP);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <GenericModal
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onCancel={handleLoginRedirect}
        onConfirm={handleSignupRedirect}
        cancelLabel={t("createProfileHome.latestUpload.loginModal.cancelLabel")}
        confirmLabel={t(
          "createProfileHome.latestUpload.loginModal.confirmLabel",
        )}
        buttonRow
        buttonAlign={MODAL_ALIGN.CENTER}
        fullWidthButtons={false}
        size="md"
        spacing="start"
        showCloseButton
      >
        <ModalContentWrapper>
          <MonoText $use="Heading3">
            {t("createProfileHome.latestUpload.loginModal.title")}
          </MonoText>
          <ModalDescription>
            {t("createProfileHome.latestUpload.loginModal.message")}
          </ModalDescription>
        </ModalContentWrapper>
      </GenericModal>
    </>
  );
}
