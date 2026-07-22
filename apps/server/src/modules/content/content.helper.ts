import { db } from 'src/database/db';
import { and, eq, ilike, isNull, ne, or, sql, SQL } from 'drizzle-orm';
import { mediaFiles, users } from 'src/database/schema';
import { formatTimeAgo } from 'src/utils/formatTimeAgo';
import {
  SLUG_EDGE_DASH_RE,
  SLUG_NON_ALPHANUMERIC_RE,
} from 'src/utils/constant';

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

export const checkDuplicateContentTitle = async (
  creatorId: string,
  title: string,
  contentTypeId: string | null | undefined,
  excludeContentId?: string,
) => {
  const conditions: SQL[] = [
    eq(mediaFiles.creatorId, creatorId),
    sql`LOWER(${mediaFiles.title}) = LOWER(${title})`,
  ];

  if (contentTypeId === null || contentTypeId === undefined) {
    conditions.push(isNull(mediaFiles.contentTypeId));
  } else {
    conditions.push(eq(mediaFiles.contentTypeId, contentTypeId));
  }

  conditions.push(eq(mediaFiles.isDeleted, false));

  if (excludeContentId) {
    conditions.push(ne(mediaFiles.id, excludeContentId));
  }

  const existing = await db
    .select({ id: mediaFiles.id })
    .from(mediaFiles)
    .where(and(...conditions))
    .limit(1);

  return existing.length > 0;
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
