import { HttpException, HttpStatus } from '@nestjs/common';
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

export const getPurchasedData = async (userId: string) => {
  try {
    if (!userId) {
      return fail('User ID is required', HttpStatus.BAD_REQUEST);
    }

    const ordersData = await getUserOrders(userId, ORDER_TYPES.PURCHASE);

    const mediaIds = ordersData
      .map((o) => o.mediaFileId)
      .filter(Boolean) as string[];

    const collectionIds = ordersData
      .map((o) => o.collectionId)
      .filter(Boolean) as string[];

    if (!mediaIds.length && !collectionIds.length) {
      return {
        success: true,
        message: 'Purchased data retrieved successfully',
        data: emptyPurchasedResult(),
      };
    }

    const { mediaMap, collectionMap } = buildAccessMap(ordersData);

    const [videos, audios, pdfs, collectionsData] = await Promise.all([
      getMediaByType(mediaIds, CONTENT_TYPES.VIDEO),
      getMediaByType(mediaIds, CONTENT_TYPES.AUDIO),
      getMediaByType(mediaIds, CONTENT_TYPES.PDF),
      getCollectionsWithDetails(collectionIds),
    ]);

    const allMediaIds = [...videos, ...audios, ...pdfs].map((m) => m.id);
    const categoryMap = await getMediaCategories(allMediaIds);

    return {
      success: true,
      message: 'Purchased data retrieved successfully',
      data: {
        videos: enrichMedia(videos, mediaMap, categoryMap),
        audios: enrichMedia(audios, mediaMap, categoryMap),
        pdfs: enrichMedia(pdfs, mediaMap, categoryMap),
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
