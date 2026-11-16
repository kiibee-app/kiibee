export type RecentlyViewedItem = {
  id: string;
  title: string;
  href: string;
  viewedAt: number;
  thumbnailUrl?: string;
  creatorName?: string;
};

const key = (userId: string) => `kiibee:recently-viewed:${userId}`;

const guestKey = "kiibee:recently-viewed-guest";

function readItems(storageKey: string): RecentlyViewedItem[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
    if (!Array.isArray(value)) return [];
    return value
      .filter(
        (item): item is RecentlyViewedItem =>
          typeof item?.id === "string" &&
          typeof item?.title === "string" &&
          typeof item?.href === "string" &&
          item.href.startsWith("/") &&
          !item.href.startsWith("//") &&
          typeof item?.viewedAt === "number" &&
          (item.thumbnailUrl === undefined ||
            typeof item.thumbnailUrl === "string") &&
          (item.creatorName === undefined ||
            typeof item.creatorName === "string"),
      )
      .slice(0, 50);
  } catch {
    return [];
  }
}

export function readRecentlyViewed(userId: string): RecentlyViewedItem[] {
  return readItems(key(userId));
}

export function mergeGuestRecentlyViewed(userId: string) {
  const guestItems = readItems(guestKey);
  if (!guestItems.length) return;
  const newest = new Map<string, RecentlyViewedItem>();
  for (const item of [...readRecentlyViewed(userId), ...guestItems]) {
    const previous = newest.get(item.id);
    if (!previous || item.viewedAt > previous.viewedAt)
      newest.set(item.id, item);
  }
  try {
    localStorage.setItem(
      key(userId),
      JSON.stringify(
        [...newest.values()]
          .sort((a, b) => b.viewedAt - a.viewedAt)
          .slice(0, 50),
      ),
    );
    localStorage.removeItem(guestKey);
  } catch {
    // Keep guest history for a later retry if storage is unavailable.
  }
}

export function saveRecentlyViewed(
  userId: string | undefined,
  item: RecentlyViewedItem,
) {
  const storageKey = userId ? key(userId) : guestKey;
  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify(
        [
          item,
          ...readItems(storageKey).filter((entry) => entry.id !== item.id),
        ].slice(0, 50),
      ),
    );
  } catch {
    // Viewing remains available when browser storage is disabled or full.
  }
}
