import { HttpException, HttpStatus } from '@nestjs/common';
import { fail } from 'src/utils/sendResponse';
import { logger } from 'src/logger/logger';

import {
  getUserOrders,
  getCollectionMediaItems,
  buildAccessMap,
  getMediaByType,
  getMediaCategories,
  enrichMedia,
  getCollectionsWithDetails,
  emptyPurchasedResult,
} from '../viewer.helper';
import { CONTENT_TYPES, ORDER_TYPES } from 'src/utils/constant';

export const getPurchasedData = async (userId: string) => {
  try {
    if (!userId) {
      return fail('User ID is required', HttpStatus.BAD_REQUEST);
    }

    const ordersData = await getUserOrders(userId, ORDER_TYPES.PURCHASE);

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
        message: 'Purchased data retrieved successfully',
        data: emptyPurchasedResult(),
      };
    }

    const { mediaMap, collectionMap } = buildAccessMap(ordersData);

    let collectionMediaItems: { mediaFileId: string; collectionId: string }[] =
      [];
    if (collectionIds.length) {
      collectionMediaItems = await getCollectionMediaItems(collectionIds);

      for (const item of collectionMediaItems) {
        if (item.mediaFileId && !mediaMap.has(item.mediaFileId)) {
          const colDate = collectionMap.get(item.collectionId);
          if (colDate) {
            mediaMap.set(item.mediaFileId, colDate);
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
      message: 'Purchased data retrieved successfully',
      data: {
        videos: enrichMedia(videos, mediaMap, categoryMap),
        audios: enrichMedia(audios, mediaMap, categoryMap),
        pdfs: enrichMedia(pdfs, mediaMap, categoryMap),
        epubs: enrichMedia(epubs, mediaMap, categoryMap),
        webs: enrichMedia(webs, mediaMap, categoryMap),
        collections: collectionsData.map((c) => ({
          ...c,
          purchasedAt: collectionMap.get(c.id) ?? null,
        })),
      },
    };
  } catch (error) {
    logger.error('Error retrieving purchased data:', error);

    if (error instanceof HttpException) throw error;

    return fail(
      'Failed to retrieve purchased data',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
