import { HttpException, HttpStatus } from '@nestjs/common';
import { inArray } from 'drizzle-orm';
import { db } from 'src/database/db';
import { collectionItems } from 'src/database/schema';
import { fail } from 'src/utils/sendResponse';
import { logger } from 'src/logger/logger';

import {
  getUserOrders,
  buildAccessMap,
  getMediaByType,
  getMediaCategories,
  enrichMedia,
  getCollectionsWithDetails,
  emptyPurchasedResult,
} from '../viewer.helper';
import { CONTENT_TYPES, ORDER_TYPES } from 'src/utils/constant';

export const getRentedData = async (userId: string) => {
  try {
    if (!userId) {
      return fail('User ID is required', HttpStatus.BAD_REQUEST);
    }

    const ordersData = await getUserOrders(userId, ORDER_TYPES.RENTAL);

    const directMediaIds = ordersData
      .map((o) => o.mediaFileId)
      .filter(Boolean) as string[];

    const collectionIds = Array.from(
      new Set(
        ordersData.map((o) => o.collectionId).filter(Boolean) as string[],
      ),
    );

    if (!directMediaIds.length && !collectionIds.length) {
      return {
        success: true,
        message: 'Rented data retrieved successfully',
        data: emptyPurchasedResult(),
      };
    }

    const { mediaMap, collectionMap, expiresMap } = buildAccessMap(ordersData);

    let collectionMediaItems: { mediaFileId: string; collectionId: string }[] =
      [];
    if (collectionIds.length) {
      collectionMediaItems = await db
        .select({
          mediaFileId: collectionItems.mediaFileId,
          collectionId: collectionItems.collectionId,
        })
        .from(collectionItems)
        .where(inArray(collectionItems.collectionId, collectionIds));

      for (const item of collectionMediaItems) {
        if (item.mediaFileId && !mediaMap.has(item.mediaFileId)) {
          const colDate = collectionMap.get(item.collectionId);
          if (colDate) {
            mediaMap.set(item.mediaFileId, colDate);
          }
        }
        if (item.mediaFileId && !expiresMap.has(item.mediaFileId)) {
          const expDate = expiresMap.get(item.collectionId);
          if (expDate) {
            expiresMap.set(item.mediaFileId, expDate);
          }
        }
      }
    }

    const allMediaIds = Array.from(
      new Set([
        ...directMediaIds,
        ...collectionMediaItems.map((ci) => ci.mediaFileId).filter(Boolean),
      ]),
    );

    const [videos, audios, pdfs, epubs, webs, collectionsData] =
      await Promise.all([
        getMediaByType(allMediaIds, CONTENT_TYPES.VIDEO),
        getMediaByType(allMediaIds, CONTENT_TYPES.AUDIO),
        getMediaByType(allMediaIds, CONTENT_TYPES.PDF),
        getMediaByType(allMediaIds, CONTENT_TYPES.EPUB),
        getMediaByType(allMediaIds, CONTENT_TYPES.WEB),
        getCollectionsWithDetails(collectionIds),
      ]);

    const finalMediaIds = [
      ...videos,
      ...audios,
      ...pdfs,
      ...epubs,
      ...webs,
    ].map((m) => m.id);
    const categoryMap = await getMediaCategories(finalMediaIds);

    return {
      success: true,
      message: 'Rented data retrieved successfully',
      data: {
        videos: enrichMedia(videos, mediaMap, categoryMap, expiresMap),
        audios: enrichMedia(audios, mediaMap, categoryMap, expiresMap),
        pdfs: enrichMedia(pdfs, mediaMap, categoryMap, expiresMap),
        epubs: enrichMedia(epubs, mediaMap, categoryMap, expiresMap),
        webs: enrichMedia(webs, mediaMap, categoryMap, expiresMap),
        collections: collectionsData.map((c) => ({
          ...c,
          purchasedAt: collectionMap.get(c.id) ?? null,
          rentExpiresAt: expiresMap.get(c.id) ?? null,
        })),
      },
    };
  } catch (error) {
    logger.error('Error retrieving rented data:', error);

    if (error instanceof HttpException) throw error;

    return fail(
      'Failed to retrieve rented data',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
