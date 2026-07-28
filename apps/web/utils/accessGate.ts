import { isBrowser } from "@/utils/ui";
import { STRING_TRUE } from "@/utils/Constants";

export const getCreatorUnlockStorageKey = (
  targetCreatorId: string | null = null,
  currentUserId: string | null = null,
): string | null => {
  if (!targetCreatorId) return null;
  return `kiibee:gate:unlocked:creator:creator=${targetCreatorId}${currentUserId ? `:user=${currentUserId}` : ""}`;
};

export const getContentUnlockStorageKey = (contentId: string): string => {
  return `kiibee:gate:unlocked:content:${contentId}`;
};

export const getCollectionUnlockStorageKey = (collectionId: string): string => {
  return `kiibee:gate:unlocked:collection:${collectionId}`;
};

export const unlockCreatorAccessGate = (
  targetCreatorId: string | null = null,
  currentUserId: string | null = null,
  shouldReload = true,
): void => {
  if (!targetCreatorId || !isBrowser) return;

  const unlockKey = getCreatorUnlockStorageKey(targetCreatorId, currentUserId);
  if (!unlockKey) return;

  window.localStorage.setItem(unlockKey, STRING_TRUE);
  if (shouldReload) {
    window.location.reload();
  }
};
