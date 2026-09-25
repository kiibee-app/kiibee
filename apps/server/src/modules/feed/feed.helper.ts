import { ilike, or } from 'drizzle-orm';
import { mediaFiles, users } from 'src/database/schema';
import { formatTimeAgo } from 'src/utils/formatTimeAgo';

export const baseConditions = (CONTENT_VISIBILITY: any) => [
  CONTENT_VISIBILITY.PUBLIC,
];

export const format = (items: any[]) =>
  items.map((item) => ({
    ...item,
    publishedAgo: formatTimeAgo(item.createdAt),
  }));

export const dedupeFeedMediaById = <T extends { id: string }>(
  items: T[],
): T[] => {
  const seen = new Set<string>();
  const unique: T[] = [];

  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    unique.push(item);
  }

  return unique;
};

export const dedupeFeedMediaByCreator = <
  T extends { creatorId?: string | null },
>(
  items: T[],
  limit?: number,
): T[] => {
  const seen = new Set<string>();
  const unique: T[] = [];

  for (const item of items) {
    const creatorKey = item.creatorId?.trim();
    if (creatorKey) {
      if (seen.has(creatorKey)) continue;
      seen.add(creatorKey);
    }

    unique.push(item);
    if (limit != null && unique.length >= limit) break;
  }

  return unique;
};

export const orderFeedMediaByIds = <T extends { id: string }>(
  items: T[],
  ids: string[],
): T[] =>
  ids
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is T => item != null);

export const buildSearch = (search?: string) => {
  if (!search?.trim()) return undefined;

  const q = `%${search}%`;

  return or(
    ilike(mediaFiles.title, q),
    ilike(mediaFiles.description, q),
    ilike(users.fullName, q),
  );
};

export const cleanNumber = (value: any) => {
  if (value === '' || value === undefined) return undefined;
  const num = Number(value);
  return isNaN(num) ? undefined : num;
};
