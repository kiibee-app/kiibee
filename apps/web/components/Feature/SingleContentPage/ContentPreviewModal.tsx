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
  getPdfEmbedUrl,
} from "@/utils/media";
import EpubViewer from "@/utils/EpubViewer";
import AudioPlayer from "./AudioPlayer";
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
  coverImage?: string;
};

export default function ContentPreviewModal({
  visible,
  onClose,
  src,
  type,
  title,
  coverImage,
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
        return (
          <PreviewContent
            as="iframe"
            src={getPdfEmbedUrl(src)}
            title={title}
            allowFullScreen
          />
        );
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
        if (
          isCloudflareStreamEmbedUrl(src) &&
          !src.toLowerCase().includes(".m3u8")
        ) {
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
        return <AudioPlayer src={src} title={title} coverImage={coverImage} />;
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
