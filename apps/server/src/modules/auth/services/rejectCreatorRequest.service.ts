import { HttpException, HttpStatus } from '@nestjs/common';
import { eq, and } from 'drizzle-orm/sql/expressions/conditions';
import { db } from 'src/database/db';
import { creatorApplicationRequests } from 'src/database/schema/users/creatorApplicationRequests.schema';
import { sendTemplateEmail } from 'src/lib/sendTemplateEmail';
import { logger } from 'src/logger/logger';
import { runInBackground } from 'src/utils/backgroundTask';
import { STATUS } from 'src/utils/constant';
import { mailSubject, templateName } from 'src/utils/mailServiceConstant';
import { success } from 'src/utils/sendResponse';

type CreatorRequest = typeof creatorApplicationRequests.$inferSelect;

export const rejectCreatorRequestService = async (
  requestId: string,
  approverUserId: string,
) => {
  try {
    if (!requestId || !approverUserId) {
      throw new HttpException(
        'Request ID and approver User ID are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    let email: string | null = null;
    let name: string | null = null;

    await db.transaction(async (tx) => {
      const result: CreatorRequest[] = await tx
        .select()
        .from(creatorApplicationRequests)
        .where(
          and(
            eq(creatorApplicationRequests.id, requestId),
            eq(creatorApplicationRequests.isDeleted, false),
          ),
        )
        .limit(1);

      if (!result || result.length === 0) {
        throw new HttpException(
          'Creator request not found or already processed',
          HttpStatus.NOT_FOUND,
        );
      }

      const request = result[0];
      email = request.email;
      name = request.firstName;

      await tx
        .update(creatorApplicationRequests)
        .set({
          isDeleted: true,
          status: STATUS.REJECTED,
          approvedUserId: approverUserId,
          updatedAt: new Date(),
        })
        .where(eq(creatorApplicationRequests.id, requestId));
    });

    if (email && name) {
      runInBackground(
        sendTemplateEmail({
          to: email,
          subject: mailSubject.REJECTED_CREATOR,
          templateName: templateName.REJECTED_CREATOR,
          variables: {
            name,
          },
        }),
      );
    }

    const responseData = {
      id: requestId,
      status: STATUS.REJECTED,
    };

    return success(
      responseData,
      'Creator request rejected successfully',
      HttpStatus.CREATED,
    );
  } catch (error) {
    logger.error('Error rejecting creator request:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Failed to reject creator request',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
