"use client";

import { useEffect, useState } from "react";
import {
  CARD_DISPLAY_MAX_EDGE,
  downscaleRemoteImage,
} from "@/utils/downscaleRemoteImage";

export function useDownscaledRemoteImage(
  remoteUrl: string | null | undefined,
  enabled: boolean,
  maxEdge: number = CARD_DISPLAY_MAX_EDGE,
): {
  displaySrc: string | null;
  isPreparing: boolean;
} {
  const [displaySrc, setDisplaySrc] = useState<string | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);

  useEffect(() => {
    if (!enabled || !remoteUrl) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplaySrc(null);
      setIsPreparing(false);
      return;
    }

    let cancelled = false;
    let objectUrl: string | null = null;
    setIsPreparing(true);
    setDisplaySrc(null);

    downscaleRemoteImage(remoteUrl, maxEdge).then((result) => {
      if (cancelled) {
        if (result.startsWith("blob:")) {
          URL.revokeObjectURL(result);
        }
        return;
      }

      if (result.startsWith("blob:")) {
        objectUrl = result;
      }
      setDisplaySrc(result);
      setIsPreparing(false);
    });

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [remoteUrl, enabled, maxEdge]);

  return {
    displaySrc: enabled ? displaySrc : null,
    isPreparing: enabled && isPreparing,
  };
}
