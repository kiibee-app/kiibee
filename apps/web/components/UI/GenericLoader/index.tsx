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
import type { GenericLoaderProps } from "@/utils/types";
import {
  KEYBOARD,
  EVENT,
  CSS_VALUE,
  LOADER_VARIANT,
  DEFAULT_LOADER_SIZE,
} from "@/utils/ui";

export default function GenericLoader({
  isOpen = true,
  variant = LOADER_VARIANT.OVERLAY,
  size = DEFAULT_LOADER_SIZE,
  label,
  isTransparent = false,
  closeOnEsc = false,
  onClose,
  className,
}: GenericLoaderProps) {
  useEffect(() => {
    if (!closeOnEsc || !onClose) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === KEYBOARD.ESCAPE) onClose();
    };

    document.addEventListener(EVENT.KEYDOWN, handleKeyDown);
    return () => document.removeEventListener(EVENT.KEYDOWN, handleKeyDown);
  }, [closeOnEsc, onClose]);

  useEffect(() => {
    if (variant === LOADER_VARIANT.OVERLAY && isOpen) {
      document.body.style.overflow = CSS_VALUE.HIDDEN;
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [variant, isOpen]);

  if (!isOpen) return null;

  const spinner = <Spinner $size={size} />;
  const content = label ? <Label>{label}</Label> : null;

  if (variant === LOADER_VARIANT.INLINE) {
    return (
      <InlineWrapper $size={size} className={className}>
        {spinner}
        {content}
      </InlineWrapper>
    );
  }

  if (variant === LOADER_VARIANT.FULLPAGE) {
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
