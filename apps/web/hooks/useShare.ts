"use client";

import { useCallback, useState } from "react";
import { isBrowser } from "@/utils/ui";
import { SHARE_STATUS, ShareStatus } from "@/utils/Constants";

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

  const share = useCallback(async () => {
    if (!shareUrl) return;

    const copyFallback = async () => {
      await navigator.clipboard.writeText(shareUrl);
      setStatus(SHARE_STATUS.COPIED);
    };

    try {
      if (navigator.share) {
        await navigator.share({ url: shareUrl });
        setStatus(SHARE_STATUS.SHARED);
        return;
      }

      setShowShareModal(true);
    } catch {
      await copyFallback().catch(() => setStatus(SHARE_STATUS.FAILED));
    }
  }, [shareUrl]);

  return { share, status, shareUrl, showShareModal, setShowShareModal };
}
