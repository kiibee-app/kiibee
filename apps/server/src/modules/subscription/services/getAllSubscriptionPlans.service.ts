import { HttpException, HttpStatus } from '@nestjs/common';
import { db } from 'src/database/db';
import { plans } from 'src/database/schema';
import { fail, success } from 'src/utils/sendResponse';
import { eq } from 'drizzle-orm/sql/expressions/conditions';
import { logger } from 'src/logger/logger';

export const getAllSubscriptionPlansService = async () => {
  try {
    const activePlans = await db
      .select()
      .from(plans)
      .where(eq(plans.isActive, true));

    if (!activePlans || activePlans.length === 0) {
      return success(
        null,
        'Active subscription plans retrieved successfully',
        HttpStatus.OK,
      );
    }

    return success(
      activePlans,
      'Active subscription plans retrieved successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error setting up creator account:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    return fail(
      'Failed to setup creator account',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
