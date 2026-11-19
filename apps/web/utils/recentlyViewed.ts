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
    // History sync must still work when browser storage is unavailable.
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
    // Private browsing or a full storage quota must not prevent account sync.
  }
  if (userId) {
    void syncRecentlyViewed(userId, [item]).catch(() => {
      // Keep the local copy for retry when the viewer panel opens.
    });
  }
}

/** Import this browser's legacy history and read the account-wide result. */
export async function syncRecentlyViewed(
  userId: string,
  items = readRecentlyViewed(userId),
): Promise<RecentlyViewedItem[]> {
  const [{ axiosClient }, { API }, { readStoredLoginUser }] = await Promise.all(
    [
      import("@/lib/http/axiosClient"),
      import("@/lib/http/api/endpoints"),
      import("@/hooks/auth/useLogin"),
    ],
  );
  // Do not import another account's local history after a session switch.
  if (readStoredLoginUser()?.id !== userId) return [];
  const response = items.length
    ? await axiosClient.post<{ data: RecentlyViewedItem[] }>(
        API.viewer.recentlyViewed,
        { items },
      )
    : await axiosClient.get<{ data: RecentlyViewedItem[] }>(
        API.viewer.recentlyViewed,
      );
  return response.data.data;
}
