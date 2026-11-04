"use client";

import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { CrossIcon } from "@/assets/icons/crossIcon";
import { canUseDOM } from "@/utils/ui";
import { FORMAT_TYPE } from "@/utils/types";
import GenericSpinner from "@/components/UI/GenericSpinner";
import type { ContentType } from "@/utils/content";
import {
  isCloudflareStreamEmbedUrl,
  isYouTubeUrl,
  getYouTubeEmbedUrl,
  isVimeoUrl,
  getVimeoEmbedUrl,
} from "@/utils/media";
import dynamic from "next/dynamic";
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

const PdfViewer = dynamic(() => import("@/components/UI/PdfViewer"), {
  ssr: false,
  loading: () => <GenericSpinner size={48} isLocal />,
});

const EpubViewer = dynamic(() => import("@/utils/EpubViewer"), {
  ssr: false,
  loading: () => <GenericSpinner size={36} isLocal />,
});

type ContentPreviewModalProps = {
  visible: boolean;
  keepMounted?: boolean;
  onClose: () => void;
  src: string;
  type: ContentType;
  title: string;
  coverImage?: string;
};

export default function ContentPreviewModal({
  visible,
  keepMounted = false,
  onClose,
  src,
  type,
  title,
  coverImage,
}: ContentPreviewModalProps) {
  const [isLoading, setIsLoading] = useState(type === FORMAT_TYPE.WEB);

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

  if ((!visible && !keepMounted) || !canUseDOM) return null;

  const renderContent = () => {
    const videoEmbed = (() => {
      if (isCloudflareStreamEmbedUrl(src)) return src;
      if (isYouTubeUrl(src)) return getYouTubeEmbedUrl(src);
      if (isVimeoUrl(src)) return getVimeoEmbedUrl(src);
      return null;
    })();

    const renderVideoFrame = (embedSrc: string) => (
      <PreviewContent
        as="iframe"
        src={embedSrc}
        title={title}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        style={{ background: COLORS.primary.BLACK }}
      />
    );

    switch (type) {
      case FORMAT_TYPE.PDF:
        return <PdfViewer key={src} src={src} title={title} />;
      case FORMAT_TYPE.WEB:
        if (videoEmbed) {
          return renderVideoFrame(videoEmbed);
        }
        return (
          <>
            {isLoading && <GenericSpinner size={48} isLocal />}
            <PreviewContent
              as="iframe"
              src={src}
              title={title}
              allowFullScreen
              onLoad={() => setIsLoading(false)}
            />
          </>
        );
      case FORMAT_TYPE.EPUB:
        return <EpubViewer key={src} src={src} />;
      case FORMAT_TYPE.VIDEO:
        if (videoEmbed) {
          return renderVideoFrame(videoEmbed);
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
      aria-modal={visible || undefined}
      aria-hidden={!visible || undefined}
      inert={!visible}
      style={visible ? undefined : { opacity: 0, pointerEvents: "none" }}
      aria-label={title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <PreviewModalContainer>
        <PreviewCloseButton
          $compact={type === FORMAT_TYPE.PDF}
          type="button"
          aria-label="Close"
          onClick={onClose}
        >
          <CrossIcon />
        </PreviewCloseButton>
        {renderContent()}
      </PreviewModalContainer>
    </PreviewOverlay>,
    document.body,
  );
}
