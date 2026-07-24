import {
  BadRequestException,
  ForbiddenException,
  GoneException,
  HttpStatus,
} from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import { contentAccessRequests, users } from 'src/database/schema';
import { STATUS } from 'src/utils/constant';
import { success } from 'src/utils/sendResponse';
import { getAccessRequest } from './contentAccessQuery.service';

export const redeemContentAccessService = async (
  token: string,
  userId: string,
) => {
  const request = await getAccessRequest(token);

  if (request.status !== STATUS.APPROVED) {
    throw new ForbiddenException('Content access request is not approved');
  }

  if (request.expiresAt.getTime() < Date.now()) {
    throw new GoneException('Content access request has expired');
  }

  const [user] = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const accountEmail = user?.email.trim().toLowerCase();
  if (!accountEmail) {
    throw new BadRequestException('User email not found');
  }

  const requestEmail = request.viewerEmail.trim().toLowerCase();
  const now = new Date();

  if (requestEmail !== accountEmail) {
    const [existingForAccount] = await db
      .select({ id: contentAccessRequests.id })
      .from(contentAccessRequests)
      .where(
        and(
          eq(contentAccessRequests.creatorId, request.creatorId),
          eq(contentAccessRequests.contentId, request.contentId),
          sql`lower(${contentAccessRequests.viewerEmail}) = ${accountEmail}`,
        ),
      )
      .limit(1);

    await db
      .update(contentAccessRequests)
      .set(
        existingForAccount
          ? {
              status: STATUS.APPROVED,
              approvedAt: now,
              updatedAt: now,
            }
          : {
              viewerEmail: accountEmail,
              updatedAt: now,
            },
      )
      .where(
        eq(contentAccessRequests.id, existingForAccount?.id ?? request.id),
      );
  }

  return success(
    {
      contentId: request.contentId,
      status: STATUS.APPROVED,
    },
    'Content access redeemed successfully',
    HttpStatus.OK,
  );
};
