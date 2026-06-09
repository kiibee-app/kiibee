"use client";

import { useCallback, useState } from "react";
import { isBrowser } from "@/utils/ui";
import { SHARE_STATUS, ShareStatus } from "@/utils/Constants";

export default function useShare(url?: string) {
  const [status, setStatus] = useState<ShareStatus>(SHARE_STATUS.IDLE);

  const share = useCallback(async () => {
    const shareUrl = url ?? (isBrowser ? window.location.href : "");

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

      await copyFallback();
    } catch {
      await copyFallback().catch(() => setStatus(SHARE_STATUS.FAILED));
    }
  }, [url]);

  return { share, status };
}
