"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  channelCodeVisitKey,
  hasChannelCodeVisit,
  subscribeChannelCodeVisit,
} from "@/utils/channelCodeVisit";

export function useChannelCodeVisit(
  creatorId?: string | null,
  userId?: string | null,
): boolean {
  const key = channelCodeVisitKey(creatorId, userId);
  const subscribe = useCallback(
    (onChange: () => void) => subscribeChannelCodeVisit(key, onChange),
    [key],
  );
  return useSyncExternalStore(
    subscribe,
    () => hasChannelCodeVisit(key),
    () => false,
  );
}
