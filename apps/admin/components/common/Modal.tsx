"use client";

import type { ReactNode } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 24px;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const ModalCard = styled.div`
  width: min(760px, 100%);
  max-height: calc(100vh - 48px);
  overflow: auto;
  background: ${({ theme }) => theme.colors.bg.white};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const Header = styled.div`
  padding: 18px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.text.main};
`;

const Body = styled.div`
  padding: 20px;
`;

const CloseButton = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg.white};
  color: ${({ theme }) => theme.colors.text.muted};
  border-radius: 8px;
  min-width: 34px;
  height: 34px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 500;
  line-height: 1;
`;

interface ModalProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ title, open, onClose, children }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(event) => event.stopPropagation()}>
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
