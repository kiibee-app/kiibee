import { isProfilePass } from 'src/utils/profilePayment';
import { publicCreatorName } from 'src/utils/publicCreatorName';
import {
  eq,
  and,
  inArray,
  gt,
  isNull,
  lte,
  or,
  sql,
  ilike,
  ne,
} from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  mediaFiles,
  contentTypes,
  users,
  orders,
  mediaFileCategories,
  contentCategories,
  collections,
  collectionItems,
  creatorChannels,
} from 'src/database/schema';
import { populateMissingCollectionCovers } from 'src/utils/populateMissingCollectionCovers';
import { CONTENT_TYPES, ORDER_TYPES } from 'src/utils/constant';

export const getUserOrders = async (
  userId: string,
  itemType: 'purchase' | 'rental',
) => {
  const now = new Date();

  const conditions = [
    eq(orders.userId, userId),
    eq(orders.status, 'completed'),
  ];

  if (itemType === ORDER_TYPES.RENTAL) {
    conditions.push(
      eq(orders.itemType, ORDER_TYPES.RENTAL),
      or(isNull(orders.rentExpiresAt), gt(orders.rentExpiresAt, now))!,
    );
  } else {
    conditions.push(
      or(
        eq(orders.itemType, ORDER_TYPES.PURCHASE),
        isNull(orders.itemType),
        ne(orders.itemType, ORDER_TYPES.RENTAL),
      )!,
    );
  }

  return db
    .select({
      mediaFileId: orders.mediaFileId,
      // A content order may carry its parent collection as context only.
      collectionId: sql<
        string | null
      >`case when ${orders.mediaFileId} is null then ${orders.collectionId} else null end`,
      purchasedAt: orders.createdAt,
      rentExpiresAt: orders.rentExpiresAt,
    })
    .from(orders)
    .where(and(...conditions));
};

export const getExpiredRentalOrders = async (userId: string) => {
  const now = new Date();

  return db
    .select({
      mediaFileId: orders.mediaFileId,
      // A content order may carry its parent collection as context only.
      collectionId: sql<
        string | null
      >`case when ${orders.mediaFileId} is null then ${orders.collectionId} else null end`,
      purchasedAt: orders.createdAt,
      rentExpiresAt: orders.rentExpiresAt,
    })
    .from(orders)
    .where(
      and(
        eq(orders.userId, userId),
        eq(orders.status, 'completed'),
        eq(orders.itemType, 'rental'),
        lte(orders.rentExpiresAt, now),
      ),
    );
};

export const buildAccessMap = (ordersData: any[]) => {
  const mediaMap = new Map<string, Date>();
  const collectionMap = new Map<string, Date>();
  const expiresMap = new Map<string, Date>();

  for (const o of ordersData) {
    if (o.mediaFileId) mediaMap.set(o.mediaFileId, o.purchasedAt);
    if (o.collectionId) collectionMap.set(o.collectionId, o.purchasedAt);
    if (o.mediaFileId && o.rentExpiresAt)
      expiresMap.set(o.mediaFileId, o.rentExpiresAt);
    if (o.collectionId && o.rentExpiresAt)
      expiresMap.set(o.collectionId, o.rentExpiresAt);
  }

  return { mediaMap, collectionMap, expiresMap };
};

export const getMediaCategories = async (mediaIds: string[]) => {
  if (!mediaIds.length) return new Map<string, string>();

  const result = await db
    .select({
      mediaFileId: mediaFileCategories.mediaFileId,
      categoryName: contentCategories.name,
    })
    .from(mediaFileCategories)
    .innerJoin(
      contentCategories,
      eq(contentCategories.id, mediaFileCategories.categoryId),
    )
    .where(inArray(mediaFileCategories.mediaFileId, mediaIds));

  const map = new Map<string, string>();
  for (const row of result) {
    if (!map.has(row.mediaFileId)) {
      map.set(row.mediaFileId, row.categoryName);
    }
  }
  return map;
};

export const getMediaByType = (mediaIds: string[], type: string) => {
  if (!mediaIds.length) return Promise.resolve([]);

  const typeCondition =
    type === CONTENT_TYPES.VIDEO
      ? or(
          ilike(contentTypes.name, type),
          ilike(contentTypes.id, 'video'),
          ilike(mediaFiles.contentTypeId, 'video'),
          isNull(mediaFiles.contentTypeId),
        )
      : type === CONTENT_TYPES.WEB
        ? or(
            ilike(contentTypes.name, type),
            ilike(contentTypes.name, 'web%'),
            ilike(contentTypes.id, 'web%'),
            ilike(mediaFiles.contentTypeId, 'web%'),
          )
        : or(
            ilike(contentTypes.name, type),
            ilike(contentTypes.id, type),
            ilike(mediaFiles.contentTypeId, type),
          );

  return db
    .select({
      id: mediaFiles.id,
      title: mediaFiles.title,
      description: mediaFiles.description,
      thumbnailUrl: mediaFiles.thumbnailUrl,
      fileKey: mediaFiles.fileKey,
      creatorId: mediaFiles.creatorId,
      buyPrice: mediaFiles.buyPrice,
      rentPrice: mediaFiles.rentPrice,
      accessType: mediaFiles.accessType,
      createdAt: mediaFiles.createdAt,
      contentType: sql<string>`coalesce(${contentTypes.name}, ${mediaFiles.contentTypeId}, 'video')`,
      creatorName: publicCreatorName,
      contentUrl: mediaFiles.contentUrl,
    })
    .from(mediaFiles)
    .leftJoin(users, eq(mediaFiles.creatorId, users.id))
    .leftJoin(contentTypes, eq(mediaFiles.contentTypeId, contentTypes.id))
    .where(and(inArray(mediaFiles.id, mediaIds), typeCondition));
};

export const enrichMedia = (
  items: any[],
  mediaMap: Map<string, Date>,
  categoryMap: Map<string, string>,
  expiresMap?: Map<string, Date>,
) => {
  return items.map((item) => {
    const expiresAt = expiresMap?.get(item.id);
    return {
      ...item,
      categoryName: categoryMap.get(item.id) ?? null,
      purchasedAt: mediaMap.get(item.id) ?? null,
      rentExpiresAt: expiresAt ?? null,
    };
  });
};

// Channel passes cover the creator's current published files, not collection_items rows.
export const getChannelPassMedia = async (collectionIds: string[]) => {
  const ids = collectionIds.filter(isProfilePass);
  if (!ids.length) return [];
  return db
    .select({
      collectionId: collections.id,
      mediaFileId: mediaFiles.id,
      thumbnailUrl: mediaFiles.thumbnailUrl,
      thumbnailLandscapeUrl: mediaFiles.thumbnailLandscapeUrl,
    })
    .from(collections)
    .innerJoin(
      mediaFiles,
      eq(collections.id, sql`'profile-access-' || ${mediaFiles.creatorId}`),
    )
    .where(
      and(
        inArray(collections.id, ids),
        eq(mediaFiles.isDeleted, false),
        eq(mediaFiles.isPublished, true),
        eq(mediaFiles.visibility, 'public'),
      ),
    )
    .orderBy(mediaFiles.createdAt, mediaFiles.id);
};

export const getCollectionMediaItems = async (collectionIds: string[]) => {
  if (!collectionIds.length) return [];
  const regularIds = collectionIds.filter((id) => !isProfilePass(id));
  const regular = regularIds.length
    ? await db
        .select({
          mediaFileId: collectionItems.mediaFileId,
          collectionId: collectionItems.collectionId,
        })
        .from(collectionItems)
        .where(inArray(collectionItems.collectionId, regularIds))
    : [];
  return [...regular, ...(await getChannelPassMedia(collectionIds))];
};

export const getCollectionsWithDetails = async (collectionIds: string[]) => {
  if (!collectionIds.length) return [];

  const items = await db
    .select({
      id: collections.id,
      name: collections.name,
      slug: collections.slug,
      coverImageUrl: collections.coverImageUrl,
      description: collections.description,
      creatorId: collections.creatorId,
      creatorName: publicCreatorName,
      buyPrice: collections.buyPrice,
    })
    .from(collections)
    .leftJoin(users, eq(collections.creatorId, users.id))
    .where(inArray(collections.id, collectionIds));

  await populateMissingCollectionCovers(
    db,
    items.filter((item) => !isProfilePass(item.id)),
  );
  const passMedia = await getChannelPassMedia(collectionIds);
  const passCreators = items
    .filter((item) => isProfilePass(item.id))
    .map((item) => item.creatorId);
  const channels = passCreators.length
    ? await db
        .select({
          creatorId: creatorChannels.creatorId,
          cover: creatorChannels.coverImageUrl,
          logo: creatorChannels.logoUrl,
        })
        .from(creatorChannels)
        .where(inArray(creatorChannels.creatorId, passCreators))
    : [];
  for (const item of items.filter((item) => isProfilePass(item.id))) {
    const channel = channels.find((row) => row.creatorId === item.creatorId);
    const thumbnail = passMedia.find(
      (row) =>
        row.collectionId === item.id &&
        (row.thumbnailUrl || row.thumbnailLandscapeUrl),
    );
    item.coverImageUrl ||=
      channel?.cover ||
      channel?.logo ||
      thumbnail?.thumbnailUrl ||
      thumbnail?.thumbnailLandscapeUrl ||
      null;
  }

  const counts = await db
    .select({
      collectionId: collectionItems.collectionId,
      count: sql<number>`count(*)::int`,
    })
    .from(collectionItems)
    .innerJoin(mediaFiles, eq(mediaFiles.id, collectionItems.mediaFileId))
    .where(
      and(
        inArray(collectionItems.collectionId, collectionIds),
        or(eq(mediaFiles.isDeleted, false), isNull(mediaFiles.isDeleted)),
      ),
    )
    .groupBy(collectionItems.collectionId);

  const countMap = new Map<string, number>();
  for (const row of counts) {
    countMap.set(row.collectionId, row.count);
  }

  return items.map((item) => ({
    ...item,
    elementCount: isProfilePass(item.id)
      ? passMedia.filter((row) => row.collectionId === item.id).length
      : (countMap.get(item.id) ?? 0),
  }));
};

export const enrichCollections = (
  items: any[],
  collectionMap: Map<string, Date>,
) => {
  return items.map((item) => ({
    ...item,
    purchasedAt: collectionMap.get(item.id) ?? null,
  }));
};

export const emptyPurchasedResult = () => ({
  videos: [],
  audios: [],
  pdfs: [],
  epubs: [],
  webs: [],
  collections: [],
});
