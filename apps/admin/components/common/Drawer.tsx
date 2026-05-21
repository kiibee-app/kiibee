"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import {
  Body,
  CloseButton,
  Header,
  DrawerCard,
  Overlay,
  Title,
} from "./Drawer.styles";

interface DrawerProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Drawer({ title, open, onClose, children }: DrawerProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <Overlay onClick={onClose}>
      <DrawerCard onClick={(event) => event.stopPropagation()}>
        <Header>
          <Title>{title}</Title>
          <CloseButton type="button" onClick={onClose} aria-label="Close panel">
            <X size={18} />
          </CloseButton>
        </Header>
        <Body>{children}</Body>
      </DrawerCard>
    </Overlay>
  );
}
