"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import {
  Overlay,
  ModalContainer,
  CloseButton,
  ShareContent,
  ShareTitle,
  UrlRow,
  UrlText,
  CopyButton,
} from "./styles";
import { MonoText } from "../Monotext";
import { CrossIcon } from "@/assets/icons/crossIcon";
import CopyIcon from "@/assets/icons/CopyIcon";
import CheckIcon from "@/assets/icons/CheckIcon";
import { canUseDOM } from "@/utils/ui";
import { useTranslation } from "react-i18next";
import { BUTTON, ESCAPE, KEYDOWN } from "@/utils/keyboard";

type ShareModalProps = {
  visible: boolean;
  url: string;
  onClose: () => void;
};

const ShareModal: React.FC<ShareModalProps> = ({ visible, url, onClose }) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === ESCAPE) {
        onClose();
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return ReactDOM.createPortal(
    <Overlay
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <ModalContainer ref={ref} $width="400px">
        <CloseButton
          type="button"
          aria-label={t("common.close")}
          onClick={onClose}
        >
          <CrossIcon />
        </CloseButton>

        <ShareContent>
          <ShareTitle>
            <MonoText $use="H5_Medium" id="share-modal-title">
              {t("common.share")}
            </MonoText>
          </ShareTitle>

          <UrlRow>
            <UrlText>{url}</UrlText>
          </UrlRow>

          <CopyButton type="button" $copied={copied} onClick={handleCopy}>
            {copied ? (
              <>
                <CheckIcon width={16} height={16} />
                {t("common.copied")}
              </>
            ) : (
              <>
                <CopyIcon width={16} height={16} />
                {t("common.copyLink")}
              </>
            )}
          </CopyButton>
        </ShareContent>
      </ModalContainer>
    </Overlay>,
    document.body,
  );
};

export default ShareModal;
