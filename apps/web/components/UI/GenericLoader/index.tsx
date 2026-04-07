"use client";

import { useEffect } from "react";
import {
  Overlay,
  Content,
  Spinner,
  Label,
  InlineWrapper,
  FullPageWrapper,
} from "./styles";
import type { LoaderSize } from "./styles";

export type GenericLoaderVariant = "overlay" | "inline" | "fullpage";

export interface GenericLoaderProps {
  isOpen?: boolean;
  variant?: GenericLoaderVariant;
  size?: LoaderSize;
  label?: string;
  isTransparent?: boolean;
  closeOnEsc?: boolean;
  onClose?: () => void;
  className?: string;
}

export default function GenericLoader({
  isOpen = true,
  variant = "overlay",
  size = "md",
  label,
  isTransparent = false,
  closeOnEsc = false,
  onClose,
  className,
}: GenericLoaderProps) {
  useEffect(() => {
    if (!closeOnEsc || !onClose) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeOnEsc, onClose]);

  useEffect(() => {
    if (variant === "overlay" && isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [variant, isOpen]);

  if (!isOpen) return null;

  const spinner = <Spinner $size={size} />;
  const content = label ? <Label>{label}</Label> : null;

  if (variant === "inline") {
    return (
      <InlineWrapper $size={size} className={className}>
        {spinner}
        {content}
      </InlineWrapper>
    );
  }

  if (variant === "fullpage") {
    return (
      <FullPageWrapper className={className}>
        <Content>
          {spinner}
          {content}
        </Content>
      </FullPageWrapper>
    );
  }

  return (
    <Overlay
      $isTransparent={isTransparent}
      className={className}
      onClick={closeOnEsc ? onClose : undefined}
    >
      <Content>
        {spinner}
        {content}
      </Content>
    </Overlay>
  );
}
