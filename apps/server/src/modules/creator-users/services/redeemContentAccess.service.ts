import {
  BadRequestException,
  ForbiddenException,
  GoneException,
  HttpStatus,
} from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  contentAccessRequests,
  contentTypes,
  mediaFiles,
  users,
} from 'src/database/schema';
import { ACCESS_TYPE, MEDIA_FILE_TYPE, STATUS } from 'src/utils/constant';
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

// Possession of an approved, unexpired email link grants guest access only to
// nonpaid web content. Account-bound redemption remains unchanged for media.
export const redeemGuestWebContentAccessService = async (token: string) => {
  const request = await getAccessRequest(token);
  if (request.status !== STATUS.APPROVED) {
    throw new ForbiddenException('Content access request is not approved');
  }
  if (request.expiresAt.getTime() < Date.now()) {
    throw new GoneException('Content access request has expired');
  }
  const [content] = await db
    .select({
      typeId: mediaFiles.contentTypeId,
      typeName: contentTypes.name,
      accessType: mediaFiles.accessType,
    })
    .from(mediaFiles)
    .leftJoin(contentTypes, eq(contentTypes.id, mediaFiles.contentTypeId))
    .where(
      and(
        eq(mediaFiles.id, request.contentId),
        eq(mediaFiles.isDeleted, false),
      ),
    )
    .limit(1);
  const isWeb =
    content &&
    (content.typeId?.toLowerCase() === MEDIA_FILE_TYPE.WEB ||
      ['web', 'web link'].includes(content.typeName?.toLowerCase() ?? ''));
  if (!isWeb || content.accessType !== ACCESS_TYPE.EMAIL_GATED) {
    throw new ForbiddenException(
      'Guest access is only available for email-gated web content',
    );
  }
  return success(
    { contentId: request.contentId, status: STATUS.APPROVED },
    'Content access redeemed successfully',
    HttpStatus.OK,
  );
};
