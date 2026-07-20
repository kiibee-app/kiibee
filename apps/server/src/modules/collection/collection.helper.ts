import { sql, type SQLWrapper } from 'drizzle-orm';

export const slugGenerator = (name: string) => {
  return `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
};

export const getCollectionCoverImageUrlSql = (
  coverImageUrlColumn: SQLWrapper = sql`collections.cover_image_url`,
) => {
  return sql<string>`COALESCE(
    ${coverImageUrlColumn},
    (
      SELECT COALESCE(mf.thumbnail_url, mf.thumbnail_landscape_url)
      FROM collection_items ci
      JOIN media_files mf ON mf.id = ci.media_file_id
      WHERE ci.collection_id = collections.id
      ORDER BY ci.sort_order ASC
      LIMIT 1
    )
  )`.as('coverImageUrl');
};
