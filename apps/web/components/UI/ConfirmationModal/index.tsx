"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { GenericModal } from "@/components/UI/Modals";
import {
  BUTTON,
  ESCAPE,
  FOCUSABLE_ELEMENTS_SELECTOR,
  KEYDOWN,
  KEY_TAB,
  MODAL_CONTAINER_SELECTOR,
  Variant,
} from "@/utils/Constants";
import { ModalPadding, ModalSize } from "@/lib/theme/tokens";

export type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => Promise<void> | void;
  isLoading?: boolean;
  confirmVariant?: Variant;
  size?: ModalSize;
  spacing?: ModalPadding;
  padding?: string;
  buttonRow?: boolean;
  fullWidthButtons?: boolean;
  showCloseButton?: boolean;
};

export default function ConfirmationModal({
  isOpen,
  onClose,
  title,
  body,
  confirmLabel,
  cancelLabel,
  onConfirm,
  isLoading,
  confirmVariant,
  size = "sm",
  spacing,
  padding,
  buttonRow = true,
  fullWidthButtons,
  showCloseButton = false,
}: ConfirmationModalProps) {
  const { t } = useTranslation();
  const [localLoading, setLocalLoading] = useState(false);
  const activeLoading = isLoading ?? localLoading;
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current =
        document.activeElement as HTMLElement | null;
    } else {
      previouslyFocusedRef.current?.focus();
      previouslyFocusedRef.current = null;
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      previouslyFocusedRef.current?.focus();
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ESCAPE) {
        onClose();
        return;
      }

      if (e.key === KEY_TAB) {
        const container = document.querySelector(MODAL_CONTAINER_SELECTOR);
        if (!container) return;

        const focusableElements = container.querySelectorAll(
          FOCUSABLE_ELEMENTS_SELECTOR,
        );

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener(KEYDOWN, handleKeyDown);
    return () => {
      window.removeEventListener(KEYDOWN, handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const container = document.querySelector(MODAL_CONTAINER_SELECTOR);
    const el = container?.querySelector(BUTTON) as HTMLButtonElement | null;
    el?.focus();
  }, [isOpen]);

  const handleConfirm = async () => {
    try {
      setLocalLoading(true);
      await onConfirm();
    } catch (error) {
      console.error(t("common.confirmationModalError"), error);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <GenericModal
      visible={isOpen}
      title={title}
      message={body}
      cancelLabel={cancelLabel}
      confirmLabel={confirmLabel}
      onCancel={onClose}
      onClose={onClose}
      onConfirm={handleConfirm}
      confirmDisabled={activeLoading}
      confirmLoading={activeLoading}
      confirmVariant={confirmVariant}
      size={size}
      spacing={spacing}
      padding={padding}
      buttonRow={buttonRow}
      fullWidthButtons={fullWidthButtons}
      showCloseButton={showCloseButton}
    />
  );
}
