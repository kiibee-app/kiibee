"use client";

import type { ReactNode } from "react";
import {
  Body,
  CloseButton,
  Header,
  ModalCard,
  Overlay,
  Title,
  type ModalSize,
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
  size = "lg",
}: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <Overlay onClick={onClose}>
      <ModalCard $size={size} onClick={(event) => event.stopPropagation()}>
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
