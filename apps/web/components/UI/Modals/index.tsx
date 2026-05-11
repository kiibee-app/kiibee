"use client";

import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import {
  Overlay,
  ModalContainer,
  Title,
  Message,
  ButtonGroup,
  IconWrapper,
  CloseButton,
} from "./styles";
import GenericButton from "../GenericButton";
import { MonoText } from "../Monotext";
import { BUTTON, ESCAPE, KEYDOWN, VARIANT } from "@/utils/Constants";
import { Variant } from "@/utils/Constants";
import { CrossIcon } from "@/assets/icons/crossIcon";
import { canUseDOM, ModalAlign } from "@/utils/ui";
import {
  MODAL_PADDINGS,
  MODAL_WIDTHS,
  ModalPadding,
  ModalSize,
} from "@/lib/theme/tokens";

type GenericModalProps = {
  visible: boolean;
  title?: string;
  message?: string;
  children?: React.ReactNode;
  buttonRow?: boolean;
  icon?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  width?: string;
  height?: string;
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
};

export const GenericModal: React.FC<GenericModalProps> = ({
  visible,
  title,
  message,
  children,
  icon,
  buttonRow = false,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  onClose,
  width,
  height,
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
}) => {
  const ref = useRef<HTMLDivElement>(null);

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
    onClose?.();
  };

  return ReactDOM.createPortal(
    <Overlay
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "generic-modal-title" : undefined}
      aria-describedby="generic-modal-message"
      data-test-id="generic-modal-overlay"
    >
      <ModalContainer
        $width={width || (size ? MODAL_WIDTHS[size] : undefined)}
        $height={height}
        $padding={padding || (spacing ? MODAL_PADDINGS[spacing] : undefined)}
        $borderRadius={borderRadius}
        $align={textAlign}
        ref={ref}
        data-test-id="generic-modal-container"
      >
        {onClose && showCloseButton && (
          <CloseButton
            type="button"
            aria-label="Close"
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

        <Message id="generic-modal-message">
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
                disabled={confirmDisabled}
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
