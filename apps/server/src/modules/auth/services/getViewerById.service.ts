import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import { orders, userProfiles, users } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { ORDER_STATUS, ORDER_TYPES, ROLE } from 'src/utils/constant';
import { fail, success } from 'src/utils/sendResponse';

export const getViewerByIdService = async (viewerId: string) => {
  try {
    const purchaseCountSql = sql<number>`
      COUNT(DISTINCT CASE
        WHEN ${orders.itemType} = ${ORDER_TYPES.PURCHASE}
          AND ${orders.status} = ${ORDER_STATUS.COMPLETED}
        THEN ${orders.id}
      END)::int
    `;
    const rentalCountSql = sql<number>`
      COUNT(DISTINCT CASE
        WHEN ${orders.itemType} = ${ORDER_TYPES.RENTAL}
          AND ${orders.status} = ${ORDER_STATUS.COMPLETED}
        THEN ${orders.id}
      END)::int
    `;

    const [viewer] = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        fullName: users.fullName,
        email: users.email,
        role: users.role,
        status: users.status,
        isEmailVerified: users.isEmailVerified,
        isActive: users.isActive,
        avatarUrl: users.avatarUrl,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        phone: userProfiles.phone,
        cvr: userProfiles.cvr,
        address: userProfiles.address,
        city: userProfiles.city,
        postalCode: userProfiles.postalCode,
        purchaseCount: purchaseCountSql,
        rentalCount: rentalCountSql,
      })
      .from(users)
      .leftJoin(userProfiles, eq(userProfiles.userId, users.id))
      .leftJoin(orders, eq(orders.userId, users.id))
      .where(
        and(
          eq(users.id, viewerId),
          eq(users.role, ROLE.VIEWER),
          eq(users.isDeleted, false),
        ),
      )
      .groupBy(
        users.id,
        userProfiles.phone,
        userProfiles.cvr,
        userProfiles.address,
        userProfiles.city,
        userProfiles.postalCode,
      )
      .limit(1);

    if (!viewer) {
      return fail('Viewer not found', HttpStatus.NOT_FOUND);
    }

    return success(
      {
        ...viewer,
        purchaseCount: Number(viewer.purchaseCount ?? 0),
        rentalCount: Number(viewer.rentalCount ?? 0),
      },
      'Viewer fetched successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error fetching viewer:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Failed to fetch viewer',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
