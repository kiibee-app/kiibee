import { HttpException, HttpStatus } from '@nestjs/common';
import { fail } from 'src/utils/sendResponse';
import { logger } from 'src/logger/logger';

import {
  getExpiredRentalOrders,
  getUserOrders,
  buildAccessMap,
  getMediaByType,
  getMediaCategories,
  enrichMedia,
  getCollectionsWithDetails,
  emptyPurchasedResult,
} from '../viewer.helper';
import { CONTENT_TYPES, ORDER_TYPES } from 'src/utils/constant';

export const getExpiredRentedData = async (userId: string) => {
  try {
    if (!userId) {
      return fail('User ID is required', HttpStatus.BAD_REQUEST);
    }

    const expiredRentalOrders = await getExpiredRentalOrders(userId);

    if (!expiredRentalOrders.length) {
      return {
        success: true,
        message: 'Expired rented data retrieved successfully',
        data: emptyPurchasedResult(),
      };
    }

    const [purchasedOrders, activeRentalOrders] = await Promise.all([
      getUserOrders(userId, ORDER_TYPES.PURCHASE),
      getUserOrders(userId, ORDER_TYPES.RENTAL),
    ]);

    const activeMediaIds = new Set([
      ...purchasedOrders.map((order) => order.mediaFileId).filter(Boolean),
      ...activeRentalOrders.map((order) => order.mediaFileId).filter(Boolean),
    ]);

    const activeCollectionIds = new Set([
      ...purchasedOrders.map((order) => order.collectionId).filter(Boolean),
      ...activeRentalOrders.map((order) => order.collectionId).filter(Boolean),
    ]);

    const latestExpiredOrderMap = new Map<
      string,
      (typeof expiredRentalOrders)[0]
    >();

    for (const order of expiredRentalOrders) {
      const key = order.mediaFileId
        ? `media_${order.mediaFileId}`
        : `collection_${order.collectionId}`;

      const existing = latestExpiredOrderMap.get(key);

      if (
        !existing ||
        (order.rentExpiresAt &&
          existing.rentExpiresAt &&
          new Date(order.rentExpiresAt).getTime() >
            new Date(existing.rentExpiresAt).getTime())
      ) {
        latestExpiredOrderMap.set(key, order);
      }
    }

    const uniqueExpiredRentalOrders = Array.from(
      latestExpiredOrderMap.values(),
    );

    const onlyExpiredRentalOrders = uniqueExpiredRentalOrders.filter(
      (order) => {
        const isMediaActive =
          order.mediaFileId && activeMediaIds.has(order.mediaFileId);
        const isCollectionActive =
          order.collectionId &&
          !order.mediaFileId &&
          activeCollectionIds.has(order.collectionId);

        if (isMediaActive || isCollectionActive) {
          return false;
        }
        return true;
      },
    );

    const mediaIds = onlyExpiredRentalOrders
      .map((order) => order.mediaFileId)
      .filter(Boolean) as string[];

    const collectionIds = onlyExpiredRentalOrders
      .filter((order) => !order.mediaFileId)
      .map((order) => order.collectionId)
      .filter(Boolean) as string[];

    if (!mediaIds.length && !collectionIds.length) {
      return {
        success: true,
        message: 'Expired rented data retrieved successfully',
        data: emptyPurchasedResult(),
      };
    }

    const { mediaMap, collectionMap, expiresMap } = buildAccessMap(
      onlyExpiredRentalOrders,
    );

    const [videos, audios, pdfs, webs, collectionsData] = await Promise.all([
      getMediaByType(mediaIds, CONTENT_TYPES.VIDEO),
      getMediaByType(mediaIds, CONTENT_TYPES.AUDIO),
      getMediaByType(mediaIds, CONTENT_TYPES.PDF),
      getMediaByType(mediaIds, CONTENT_TYPES.WEB),
      getCollectionsWithDetails(collectionIds),
    ]);

    const allMediaIds = [...videos, ...audios, ...pdfs, ...webs].map(
      (m) => m.id,
    );
    const categoryMap = await getMediaCategories(allMediaIds);

    return {
      success: true,
      message: 'Expired rented data retrieved successfully',
      data: {
        videos: enrichMedia(videos, mediaMap, categoryMap, expiresMap),
        audios: enrichMedia(audios, mediaMap, categoryMap, expiresMap),
        pdfs: enrichMedia(pdfs, mediaMap, categoryMap, expiresMap),
        webs: enrichMedia(webs, mediaMap, categoryMap, expiresMap),
        collections: collectionsData.map((c) => ({
          ...c,
          purchasedAt: collectionMap.get(c.id) ?? null,
          rentExpiresAt: expiresMap.get(c.id) ?? null,
        })),
      },
    };
  } catch (error) {
    logger.error('Error retrieving expired rented data:', error);

    if (error instanceof HttpException) throw error;

    return fail(
      'Failed to retrieve expired rented data',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
