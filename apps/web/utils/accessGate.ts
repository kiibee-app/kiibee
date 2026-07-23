export const getCreatorUnlockStorageKey = (
  targetCreatorId?: string | null,
  currentUserId?: string | null,
): string => {
  if (!targetCreatorId) return "";
  return `kiibee:gate:unlocked:creator:creator=${targetCreatorId}${currentUserId ? `:user=${currentUserId}` : ""}`;
};

export const getContentUnlockStorageKey = (contentId: string): string => {
  return `kiibee:gate:unlocked:content:${contentId}`;
};

export const getCollectionUnlockStorageKey = (collectionId: string): string => {
  return `kiibee:gate:unlocked:collection:${collectionId}`;
};

export const unlockCreatorAccessGate = (
  targetCreatorId?: string | null,
  currentUserId?: string | null,
  shouldReload = true,
): void => {
  if (!targetCreatorId) return;
  const unlockKey = getCreatorUnlockStorageKey(targetCreatorId, currentUserId);
  if (unlockKey && typeof window !== "undefined") {
    window.localStorage.setItem(unlockKey, "true");
    if (shouldReload) {
      window.location.reload();
    }
  }
};
