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
