"use client";

import { useCallback, useState } from "react";
import { toast } from "react-toastify";

import { logger } from "@/lib/logger";
import { SHARE_STATUS, ShareStatus } from "@/utils/Constants";
import { isBrowser } from "@/utils/ui";

type UseShareReturn = {
  share: () => Promise<void>;
  status: ShareStatus;
  shareUrl: string;
  showShareModal: boolean;
  setShowShareModal: (show: boolean) => void;
};

export default function useShare(url?: string): UseShareReturn {
  const [status, setStatus] = useState<ShareStatus>(SHARE_STATUS.IDLE);
  const [showShareModal, setShowShareModal] = useState(false);

  const shareUrl = url ?? (isBrowser ? window.location.href : "");

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setStatus(SHARE_STATUS.COPIED);
    } catch (error) {
      logger.error("[useShare] Failed to copy share URL", error);
      toast.error("Failed to copy share link. Please try again.");
      setStatus(SHARE_STATUS.FAILED);
    }
  }, [shareUrl]);

  const share = useCallback(async () => {
    if (!shareUrl) return;

    if (!navigator.share) {
      setShowShareModal(true);
      return;
    }

    try {
      await navigator.share({ url: shareUrl });
      setStatus(SHARE_STATUS.SHARED);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      logger.warn(
        "[useShare] Native share failed, falling back to clipboard",
        error,
      );
      await copyToClipboard();
    }
  }, [shareUrl, copyToClipboard]);

  return {
    share,
    status,
    shareUrl,
    showShareModal,
    setShowShareModal,
  };
}
