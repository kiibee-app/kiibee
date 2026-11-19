import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import { mediaFiles, recentlyViewed } from 'src/database/schema';
import { success } from 'src/utils/sendResponse';
import { RecentlyViewedItemDto } from '../dto/recentlyViewed.dto';

export async function getRecentlyViewed(userId: string) {
  const rows = await db
    .select()
    .from(recentlyViewed)
    .where(eq(recentlyViewed.userId, userId))
    .orderBy(desc(recentlyViewed.viewedAt), recentlyViewed.contentId)
    .limit(50);
  return success(
    rows.map((row) => ({
      ...row.metadata,
      id: row.contentId,
      viewedAt: row.viewedAt,
    })),
  );
}

export async function syncRecentlyViewed(
  userId: string,
  items: RecentlyViewedItemDto[],
) {
  // Ignore deleted or invalid legacy content rather than failing the whole import.
  if (items.length) {
    const existing = await db
      .select({ id: mediaFiles.id })
      .from(mediaFiles)
      .where(
        inArray(
          mediaFiles.id,
          items.map((item) => item.id),
        ),
      );
    const ids = new Set(existing.map((row) => row.id));
    const newest = new Map<string, RecentlyViewedItemDto>();
    for (const item of items) {
      if (
        ids.has(item.id) &&
        (!newest.has(item.id) || newest.get(item.id)!.viewedAt < item.viewedAt)
      ) {
        newest.set(item.id, item);
      }
    }
    const values = [...newest.values()].map(
      ({ id, viewedAt, ...metadata }) => ({
        userId,
        contentId: id,
        viewedAt: Math.min(viewedAt, Date.now()),
        metadata,
      }),
    );
    if (values.length) {
      await db
        .insert(recentlyViewed)
        .values(values)
        .onConflictDoUpdate({
          target: [recentlyViewed.userId, recentlyViewed.contentId],
          set: {
            viewedAt: sql`excluded.viewed_at`,
            metadata: sql`excluded.metadata`,
          },
          setWhere: sql`excluded.viewed_at > ${recentlyViewed.viewedAt}`,
        });
      const retained = db
        .select({ contentId: recentlyViewed.contentId })
        .from(recentlyViewed)
        .where(eq(recentlyViewed.userId, userId))
        .orderBy(desc(recentlyViewed.viewedAt), recentlyViewed.contentId)
        .limit(50);
      await db
        .delete(recentlyViewed)
        .where(
          and(
            eq(recentlyViewed.userId, userId),
            sql`${recentlyViewed.contentId} not in (${retained})`,
          ),
        );
    }
  }
  return getRecentlyViewed(userId);
}
