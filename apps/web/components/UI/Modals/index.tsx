"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Overlay,
  ModalContainer,
  Title,
  Message,
  ButtonGroup,
  IconWrapper,
  CloseButton,
  LoginRequiredBody,
  LoginRequiredDescription,
} from "./styles";
import GenericButton from "../GenericButton";
import { MonoText } from "../Monotext";
import { BUTTON, ESCAPE, KEYDOWN, VARIANT } from "@/utils/Constants";
import { Variant } from "@/utils/Constants";
import { CrossIcon } from "@/assets/icons/crossIcon";
import {
  canUseDOM,
  LOGIN_REQUIRED_MODAL_INITIAL_HEIGHT,
  LOGIN_REQUIRED_MODAL_OVERLAY_Z_INDEX,
  LOGIN_REQUIRED_MODAL_WIDTH,
  MODAL_ALIGN,
  ModalAlign,
} from "@/utils/ui";
import { useTranslation } from "react-i18next";
import {
  MODAL_PADDINGS,
  MODAL_WIDTHS,
  ModalPadding,
  ModalSize,
} from "@/lib/theme/tokens";
import LoginForm from "@/components/Feature/Auth/Login/LoginForm";
import SignUpViewer from "@/components/Feature/Auth/SignUpViewer";
import ViewerPreference from "@/components/Feature/Auth/SignUpViewer/viewersPreference";

type GenericModalProps = {
  visible: boolean;
  title?: string;
  message?: string;
  children?: React.ReactNode;
  contentMarginBottom?: string;
  buttonRow?: boolean;
  icon?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  width?: string;
  height?: string;
  maxHeight?: string;
  padding?: string;
  size?: ModalSize;
  spacing?: ModalPadding;
  borderRadius?: string;
  iconMargin?: string;
  fullWidthButtons?: boolean;
  buttonAlign?: ModalAlign;
  textAlign?: ModalAlign;
  showCloseButton?: boolean;
  confirmDisabled?: boolean;
  confirmVariant?: Variant;
  closeOnConfirm?: boolean;
  confirmLoading?: boolean;
  overlayZIndex?: number;
};

export const GenericModal: React.FC<GenericModalProps> = ({
  visible,
  title,
  message,
  children,
  contentMarginBottom,
  icon,
  buttonRow = false,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  onClose,
  width,
  height,
  maxHeight,
  padding,
  size,
  spacing,
  borderRadius,
  iconMargin,
  fullWidthButtons = false,
  buttonAlign,
  textAlign,
  showCloseButton = true,
  confirmDisabled = false,
  confirmVariant = VARIANT.PRIMARY,
  closeOnConfirm = true,
  confirmLoading = false,
  overlayZIndex,
}) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const resolvedPadding =
    padding && padding in MODAL_PADDINGS
      ? MODAL_PADDINGS[padding as ModalPadding]
      : padding;

  useEffect(() => {
    if (!visible) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === ESCAPE) {
        onClose?.();
      }
    };

    window.addEventListener(KEYDOWN, handleKey);
    return () => window.removeEventListener(KEYDOWN, handleKey);
  }, [visible, onClose]);

  useEffect(() => {
    if (!visible) return;
    const el = ref.current?.querySelector(BUTTON) as HTMLButtonElement | null;
    el?.focus();
  }, [visible]);

  if (!visible || !canUseDOM) return null;

  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  };

  const handleConfirm = () => {
    onConfirm?.();
    if (closeOnConfirm) {
      onClose?.();
    }
  };

  return ReactDOM.createPortal(
    <Overlay
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "generic-modal-title" : undefined}
      aria-describedby="generic-modal-message"
      data-test-id="generic-modal-overlay"
      style={overlayZIndex ? { zIndex: overlayZIndex } : undefined}
    >
      <ModalContainer
        $width={width || (size ? MODAL_WIDTHS[size] : undefined)}
        $height={height}
        $maxHeight={maxHeight}
        $padding={
          resolvedPadding || (spacing ? MODAL_PADDINGS[spacing] : undefined)
        }
        $borderRadius={borderRadius}
        $align={textAlign}
        ref={ref}
        data-test-id="generic-modal-container"
      >
        {onClose && showCloseButton && (
          <CloseButton
            type="button"
            aria-label={t("common.close")}
            onClick={onClose}
            data-test-id="generic-modal-close"
          >
            <CrossIcon />
          </CloseButton>
        )}

        {icon && (
          <IconWrapper $margin={iconMargin} data-test-id="generic-modal-icon">
            {icon}
          </IconWrapper>
        )}

        {title && (
          <Title id="generic-modal-title" data-test-id="generic-modal-title">
            <MonoText $use="H5_Medium">{title}</MonoText>
          </Title>
        )}

        <Message id="generic-modal-message" $marginBottom={contentMarginBottom}>
          {children ? (
            children
          ) : (
            <MonoText $use="Body_Medium">{message}</MonoText>
          )}
        </Message>

        {(confirmLabel || (cancelLabel && onCancel)) && (
          <ButtonGroup
            $fullWidthButtons={fullWidthButtons}
            $row={buttonRow}
            $align={buttonAlign}
            data-test-id="generic-modal-button-group"
          >
            {cancelLabel && onCancel && (
              <GenericButton
                variant="secondary"
                onClick={handleCancel}
                data-test-id="generic-modal-cancel-button"
              >
                {cancelLabel}
              </GenericButton>
            )}

            {confirmLabel && (
              <GenericButton
                variant={confirmVariant}
                onClick={handleConfirm}
                disabled={confirmDisabled || confirmLoading}
                isLoading={confirmLoading}
                data-test-id="generic-modal-confirm-button"
              >
                {confirmLabel}
              </GenericButton>
            )}
          </ButtonGroup>
        )}
      </ModalContainer>
    </Overlay>,
    document.body,
  );
};

const LOGIN_VIEW_STATES = {
  INITIAL: "initial",
  LOGIN: "login",
  REGISTER: "register",
  PREFERENCES: "preferences",
} as const;

type LoginViewState =
  (typeof LOGIN_VIEW_STATES)[keyof typeof LOGIN_VIEW_STATES];

const INTENT_PURCHASE = "purchase";

type LoginRequiredModalProps = {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  width?: string;
  initialHeight?: string;
  title?: string;
  message?: string;
};

export function LoginRequiredModal({
  visible,
  onClose,
  onSuccess,
  width = LOGIN_REQUIRED_MODAL_WIDTH,
  initialHeight = LOGIN_REQUIRED_MODAL_INITIAL_HEIGHT,
  title,
  message,
}: LoginRequiredModalProps) {
  const { t } = useTranslation();
  const [view, setView] = useState<LoginViewState>(LOGIN_VIEW_STATES.INITIAL);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitialView = view === LOGIN_VIEW_STATES.INITIAL;

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (!visible) {
      timeout = setTimeout(() => setView(LOGIN_VIEW_STATES.INITIAL), 300);
    }
    return () => clearTimeout(timeout);
  }, [visible]);

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    } else if (searchParams?.get("intent") === INTENT_PURCHASE) {
      router.refresh();
    } else {
      router.refresh();
    }

    onClose();
  };

  return (
    <GenericModal
      visible={visible}
      onClose={onClose}
      width={width}
      spacing={isInitialView ? "lg" : "start"}
      textAlign={isInitialView ? MODAL_ALIGN.CENTER : MODAL_ALIGN.START}
      showCloseButton
      maxHeight="85vh"
      contentMarginBottom="0"
      overlayZIndex={LOGIN_REQUIRED_MODAL_OVERLAY_Z_INDEX}
    >
      {isInitialView && (
        <LoginRequiredBody style={{ minHeight: initialHeight }}>
          <MonoText $use="H5_Medium">
            {title ?? t("createProfileHome.latestUpload.loginModal.title")}
          </MonoText>
          <LoginRequiredDescription>
            <MonoText $use="Body_Medium">
              {message ??
                t("createProfileHome.latestUpload.loginModal.viewMessage")}
            </MonoText>
          </LoginRequiredDescription>
          <ButtonGroup $row $align={MODAL_ALIGN.CENTER}>
            <GenericButton
              variant={VARIANT.PRIMARY}
              onClick={() => setView(LOGIN_VIEW_STATES.LOGIN)}
            >
              {t("createProfileHome.latestUpload.loginModal.cancelLabel")}
            </GenericButton>
            <GenericButton
              variant={VARIANT.SECONDARY}
              onClick={() => setView(LOGIN_VIEW_STATES.REGISTER)}
            >
              {t("createProfileHome.latestUpload.loginModal.confirmLabel")}
            </GenericButton>
          </ButtonGroup>
        </LoginRequiredBody>
      )}

      {view === LOGIN_VIEW_STATES.LOGIN && (
        <LoginForm
          onSuccess={handleSuccess}
          onSwitchMode={() => setView(LOGIN_VIEW_STATES.REGISTER)}
        />
      )}

      {view === LOGIN_VIEW_STATES.REGISTER && (
        <SignUpViewer
          onSuccess={() => setView(LOGIN_VIEW_STATES.PREFERENCES)}
          onSwitchMode={() => setView(LOGIN_VIEW_STATES.LOGIN)}
        />
      )}

      {view === LOGIN_VIEW_STATES.PREFERENCES && (
        <ViewerPreference
          onComplete={handleSuccess}
          onBack={() => setView(LOGIN_VIEW_STATES.REGISTER)}
        />
      )}
    </GenericModal>
  );
}
