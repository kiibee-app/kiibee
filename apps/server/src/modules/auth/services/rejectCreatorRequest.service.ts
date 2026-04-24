import { HttpException, HttpStatus } from '@nestjs/common';
import { eq, and } from 'drizzle-orm/sql/expressions/conditions';
import { db } from 'src/database/db';
import { creatorApplicationRequests } from 'src/database/schema/users/creatorApplicationRequests.schema';
import { STATUS } from 'src/utils/constant';
import { fail, success } from 'src/utils/sendResponse';

export const rejectCreatorRequestService = async (
  requestId: string,
  approverUserId: string,
) => {
  try {
    if (!requestId || !approverUserId) {
      return fail(
        'Request ID and approver User ID are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    await db.transaction(async (tx) => {
      const validatedRequest = await tx
        .select()
        .from(creatorApplicationRequests)
        .where(
          and(
            eq(creatorApplicationRequests.id, requestId),
            eq(creatorApplicationRequests.isDeleted, false),
          ),
        )
        .limit(1);

      if (!validatedRequest || validatedRequest.length === 0) {
        throw new HttpException(
          'Creator request not found or already processed',
          HttpStatus.NOT_FOUND,
        );
      }

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

    const reponseData = {
      id: requestId,
      status: STATUS.REJECTED,
    };

    return success(
      reponseData,
      'Creator request rejected successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    console.error('Error rejecting creator request:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    return fail(
      'Failed to reject creator request',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
