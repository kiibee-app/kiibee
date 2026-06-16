"use client";

import { useEffect } from "react";
import ReactDOM from "react-dom";
import { CrossIcon } from "@/assets/icons/crossIcon";
import { canUseDOM } from "@/utils/ui";
import { FORMAT_TYPE } from "@/utils/types";
import type { ContentType } from "@/utils/content";
import {
  isCloudflareStreamEmbedUrl,
  isYouTubeUrl,
  getYouTubeEmbedUrl,
  isVimeoUrl,
  getVimeoEmbedUrl,
} from "@/utils/media";
import EpubViewer from "@/utils/EpubViewer";
import {
  PreviewOverlay,
  PreviewModalContainer,
  PreviewCloseButton,
  PreviewContent,
} from "./styles";
import { ESCAPE, KEYDOWN } from "@/utils/keyboard";
import { VISIBILITY_HIDDEN_LOWER } from "@/utils/Constants";
import COLORS from "@repo/ui/colors";

type ContentPreviewModalProps = {
  visible: boolean;
  onClose: () => void;
  src: string;
  type: ContentType;
  title: string;
};

export default function ContentPreviewModal({
  visible,
  onClose,
  src,
  type,
  title,
}: ContentPreviewModalProps) {
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
    document.body.style.overflow = VISIBILITY_HIDDEN_LOWER;
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  if (!visible || !canUseDOM) return null;

  const renderContent = () => {
    switch (type) {
      case FORMAT_TYPE.PDF:
      case FORMAT_TYPE.WEB:
        return (
          <PreviewContent as="iframe" src={src} title={title} allowFullScreen />
        );
      case FORMAT_TYPE.EPUB:
        return (
          <PreviewContent>
            <EpubViewer src={src} />
          </PreviewContent>
        );
      case FORMAT_TYPE.VIDEO:
        if (isCloudflareStreamEmbedUrl(src)) {
          return (
            <PreviewContent
              as="iframe"
              src={src}
              title={title}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              style={{ background: COLORS.primary.BLACK }}
            />
          );
        }
        if (isYouTubeUrl(src)) {
          return (
            <PreviewContent
              as="iframe"
              src={getYouTubeEmbedUrl(src)}
              title={title}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              style={{ background: COLORS.primary.BLACK }}
            />
          );
        }
        if (isVimeoUrl(src)) {
          return (
            <PreviewContent
              as="iframe"
              src={getVimeoEmbedUrl(src)}
              title={title}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              style={{ background: COLORS.primary.BLACK }}
            />
          );
        }
        return (
          <PreviewContent
            as="video"
            src={src}
            controls
            preload="metadata"
            style={{ background: COLORS.primary.BLACK }}
          />
        );
      case FORMAT_TYPE.AUDIO:
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <audio
              src={src}
              controls
              preload="metadata"
              style={{ width: "80%" }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return ReactDOM.createPortal(
    <PreviewOverlay
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <PreviewModalContainer>
        <PreviewCloseButton type="button" aria-label="Close" onClick={onClose}>
          <CrossIcon />
        </PreviewCloseButton>
        {renderContent()}
      </PreviewModalContainer>
    </PreviewOverlay>,
    document.body,
  );
}
