"use client";

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
