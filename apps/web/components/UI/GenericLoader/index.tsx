"use client";

import { useEffect, useCallback } from "react";
import {
  Overlay,
  Content,
  Spinner,
  Label,
  InlineWrapper,
  FullPageWrapper,
} from "./styles";
import {
  KEYBOARD,
  EVENT,
  CSS_VALUE,
  LOADER_VARIANT,
  DEFAULT_LOADER_SIZE,
} from "@/utils/ui";
import { GenericLoaderProps } from "@/types/genericLoader";

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
  const handleEscape = useCallback(() => {
    onClose?.();
  }, [onClose]);

  useEscapeToClose({ closeOnEsc, onClose: handleEscape });
  useLockBodyScroll({
    enabled: isOpen && variant === LOADER_VARIANT.OVERLAY,
  });

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
      role="status"
      aria-label={label || "Loading"}
      aria-live="polite"
      onClick={onClose}
    >
      <Content>
        {spinner}
        {content}
      </Content>
    </Overlay>
  );
}

type EscapeToCloseOptions = {
  closeOnEsc: boolean;
  onClose?: () => void;
};

let bodyScrollLockCount = 0;
let bodyOverflowBeforeLock: string | null = null;

function useEscapeToClose({ closeOnEsc, onClose }: EscapeToCloseOptions) {
  useEffect(() => {
    if (!closeOnEsc || !onClose) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === KEYBOARD.ESCAPE) {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener(EVENT.KEYDOWN, handleKeyDown);

    return () => {
      document.removeEventListener(EVENT.KEYDOWN, handleKeyDown);
    };
  }, [closeOnEsc, onClose]);
}

function useLockBodyScroll({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled) return;

    const body = document.body;

    if (bodyScrollLockCount === 0) {
      bodyOverflowBeforeLock = body.style.overflow;
      body.style.overflow = CSS_VALUE.HIDDEN;
    }

    bodyScrollLockCount += 1;

    return () => {
      bodyScrollLockCount = Math.max(0, bodyScrollLockCount - 1);

      if (bodyScrollLockCount === 0) {
        body.style.overflow = bodyOverflowBeforeLock ?? "";
        bodyOverflowBeforeLock = null;
      }
    };
  }, [enabled]);
}
