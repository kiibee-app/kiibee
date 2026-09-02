"use client";

import { Modal } from "../../common/Modal";
import {
  CONTENT_FORMAT,
  isEmbedVideoUrl,
  toEmbeddablePreviewUrl,
  type ContentFormat,
} from "../../../utils/contentMedia";
import { contentPreviewLabels } from "../../../utils/contentConfig";
import {
  PreviewAudio,
  PreviewFrame,
  PreviewLink,
  PreviewState,
  PreviewVideo,
} from "./Creators.styles";

type ContentPreviewModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  url: string | null;
  format: ContentFormat | null;
  isLoading?: boolean;
  error?: string | null;
};

export function ContentPreviewModal({
  open,
  onClose,
  title,
  url,
  format,
  isLoading = false,
  error = null,
}: ContentPreviewModalProps) {
  const renderBody = () => {
    if (isLoading) {
      return <PreviewState>{contentPreviewLabels.loadingPreview}</PreviewState>;
    }

    if (error) {
      return <PreviewState>{error}</PreviewState>;
    }

    if (!url || !format) {
      return <PreviewState>{contentPreviewLabels.noPreview}</PreviewState>;
    }

    const previewUrl = toEmbeddablePreviewUrl(url);

    if (format === CONTENT_FORMAT.VIDEO || isEmbedVideoUrl(previewUrl)) {
      return (
        <PreviewFrame
          src={previewUrl}
          title={title}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      );
    }

    if (format === CONTENT_FORMAT.AUDIO) {
      return <PreviewAudio src={previewUrl} controls autoPlay />;
    }

    if (format === CONTENT_FORMAT.PDF || format === CONTENT_FORMAT.WEB) {
      return (
        <PreviewFrame
          src={previewUrl}
          title={title}
          allowFullScreen
          $tall={format === CONTENT_FORMAT.PDF}
        />
      );
    }

    if (format === CONTENT_FORMAT.EPUB) {
      return (
        <PreviewState>
          <PreviewLink href={url} target="_blank" rel="noreferrer">
            {contentPreviewLabels.openEpubFile}
          </PreviewLink>
        </PreviewState>
      );
    }

    return <PreviewVideo src={url} controls autoPlay />;
  };

  return (
    <Modal title={title} open={open} onClose={onClose}>
      {renderBody()}
    </Modal>
  );
}
