"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { DEFAULT_MODAL_SIZE, type ModalSize } from "../../utils/constants";
import {
  Body,
  CloseButton,
  Header,
  ModalCard,
  Overlay,
  Title,
} from "./Modal.styles";

interface ModalProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: ModalSize;
}

export function Modal({
  title,
  open,
  onClose,
  children,
  size = DEFAULT_MODAL_SIZE,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    modalRef.current?.focus();
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <Overlay onClick={onClose}>
      <ModalCard
        ref={modalRef}
        $size={size}
        onClick={(event) => event.stopPropagation()}
        tabIndex={-1}
      >
        <Header>
          <Title>{title}</Title>
          <CloseButton type="button" onClick={onClose} aria-label="Close modal">
            ×
          </CloseButton>
        </Header>
        <Body>{children}</Body>
      </ModalCard>
    </Overlay>
  );
}
