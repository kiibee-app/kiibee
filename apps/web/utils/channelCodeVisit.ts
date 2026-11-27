const EVENT = "kiibee:channel-code-visit";

export function channelCodeVisitKey(
  creatorId?: string | null,
  userId?: string | null,
): string | null {
  return creatorId && userId
    ? `kiibee:gate:code-visit:${encodeURIComponent(creatorId)}:${encodeURIComponent(userId)}`
    : null;
}

export function hasChannelCodeVisit(key: string | null): boolean {
  if (!key || typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(key) === "true";
  } catch {
    return false;
  }
}

export function rememberChannelCodeVisit(
  creatorId?: string | null,
  userId?: string | null,
): void {
  const key = channelCodeVisitKey(creatorId, userId);
  if (!key || typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(key, "true");
  } catch {
    return;
  }
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeChannelCodeVisit(
  key: string | null,
  onChange: () => void,
): () => void {
  const onStorage = (event: StorageEvent) => {
    if (
      event.storageArea === window.sessionStorage &&
      (event.key === key || event.key === null)
    )
      onChange();
  };
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}
