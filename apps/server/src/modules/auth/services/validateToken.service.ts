import { HttpException, HttpStatus } from '@nestjs/common';
import { db } from 'src/database/db';
import { usersToken } from 'src/database/schema';
import { fail, success } from 'src/utils/sendResponse';
import { and, eq, gt } from 'drizzle-orm/sql/expressions/conditions';
import { logger } from 'src/logger/logger';

export const validateTokenService = async (token: string) => {
  try {
    if (!token) {
      return fail('Token is required', HttpStatus.BAD_REQUEST);
    }

    const tokenData = await db
      .select()
      .from(usersToken)
      .where(
        and(
          eq(usersToken.token, token),
          gt(usersToken.expiresAt, new Date()),
          eq(usersToken.isUsed, false),
        ),
      )
      .limit(1);

    if (!tokenData || tokenData.length === 0) {
      return fail('Invalid or expired token', HttpStatus.UNAUTHORIZED);
    }
    const responseData = {
      userId: tokenData[0].userId,
      type: tokenData[0].type,
      token,
    };

    return success(responseData, 'Token is valid', HttpStatus.OK);
  } catch (error) {
    logger.error('Error validating token:', error);
    if (error instanceof HttpException) {
      throw error;
    }
    return fail('Failed to validate token', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};
