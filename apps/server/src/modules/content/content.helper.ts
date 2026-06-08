import { db } from 'src/database/db';
import { eq, ilike, or } from 'drizzle-orm';
import { mediaFiles, users } from 'src/database/schema';
import { formatTimeAgo } from 'src/utils/formatTimeAgo';

export const SLUG_NON_ALPHANUMERIC_RE = /[^a-z0-9]+/g;
export const SLUG_EDGE_DASH_RE = /^-+|-+$/g;

export const contentSlugGenerator = async (title: string) => {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(SLUG_NON_ALPHANUMERIC_RE, '-')
    .replace(SLUG_EDGE_DASH_RE, '');

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await db
      .select({ id: mediaFiles.id })
      .from(mediaFiles)
      .where(eq(mediaFiles.slug, slug))
      .limit(1);

    if (existing.length === 0) break;

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

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
