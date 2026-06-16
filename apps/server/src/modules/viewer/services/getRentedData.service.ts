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

export const getRentedData = async (userId: string) => {
  try {
    if (!userId) {
      return fail('User ID is required', HttpStatus.BAD_REQUEST);
    }

    const ordersData = await getUserOrders(userId, ORDER_TYPES.RENTAL);

    const mediaIds = ordersData
      .map((o) => o.mediaFileId)
      .filter(Boolean) as string[];

    const collectionIds = ordersData
      .map((o) => o.collectionId)
      .filter(Boolean) as string[];

    if (!mediaIds.length && !collectionIds.length) {
      return {
        success: true,
        message: 'Rented data retrieved successfully',
        data: emptyPurchasedResult(),
      };
    }

    const { mediaMap, collectionMap, expiresMap } = buildAccessMap(ordersData);

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
      message: 'Rented data retrieved successfully',
      data: {
        videos: enrichMedia(videos, mediaMap, categoryMap, expiresMap),
        audios: enrichMedia(audios, mediaMap, categoryMap, expiresMap),
        pdfs: enrichMedia(pdfs, mediaMap, categoryMap, expiresMap),
        collections: collectionsData.map((c) => ({
          ...c,
          purchasedAt: collectionMap.get(c.id) ?? null,
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
