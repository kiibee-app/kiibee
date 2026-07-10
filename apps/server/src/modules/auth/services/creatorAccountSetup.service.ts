import { HttpException, HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreatorAccountSetupDto } from '../dto/creatorAccountSetup.dto';
import { success } from 'src/utils/sendResponse';
import { db } from 'src/database/db';
import { creatorPlans, plans, users, usersToken } from 'src/database/schema';
import { and, eq } from 'drizzle-orm/sql/expressions/conditions';
import { ACCOUNT_STATUS } from 'src/utils/constant';
import { hashPassword } from 'src/utils/passwordHash';
import { logger } from 'src/logger/logger';

const FRONTEND_PLAN_SLUG_TO_DB_NAME: Record<string, string> = {
  'try-kiibee': 'Try Kiibee',
  'start-up': 'Start-up',
  pro: 'Pro',
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isDatabaseUuid(value: string): boolean {
  return UUID_REGEX.test(value.trim());
}

export const setupCreatorAccountService = async (
  payload: CreatorAccountSetupDto,
) => {
  try {
    const { token, planId, confirmEmail, password, confirmPassword } = payload;

    if (!token || !planId || !confirmEmail || !password || !confirmPassword) {
      throw new HttpException(
        'All fields are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (password !== confirmPassword) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }

    if (password.length < 6) {
      throw new HttpException(
        'Password must be at least 6 characters',
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordHash = await hashPassword(password);
    const normalizedConfirmEmail = confirmEmail.trim().toLowerCase();

    let userId: string | null = null;
    let resolvedPlanId: string | null = null;

    await db.transaction(async (tx) => {
      const [tokenData] = await tx
        .select()
        .from(usersToken)
        .where(eq(usersToken.token, token))
        .limit(1);

      if (!tokenData) {
        throw new HttpException(
          'Invalid or expired token',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (tokenData.isUsed) {
        throw new HttpException('Token already used', HttpStatus.BAD_REQUEST);
      }

      const [emailFromToken] = await tx
        .select({ email: users.email })
        .from(users)
        .where(eq(users.id, tokenData.userId))
        .limit(1);

      if (
        !emailFromToken ||
        emailFromToken.email.trim().toLowerCase() !== normalizedConfirmEmail
      ) {
        throw new HttpException(
          'Email does not match token',
          HttpStatus.BAD_REQUEST,
        );
      }

      userId = tokenData.userId;

      let planUuid = planId.trim();
      if (!isDatabaseUuid(planUuid)) {
        const planName = FRONTEND_PLAN_SLUG_TO_DB_NAME[planUuid];
        if (!planName) {
          throw new HttpException(
            'Invalid subscription plan',
            HttpStatus.BAD_REQUEST,
          );
        }
        const [planRow] = await tx
          .select({ id: plans.id })
          .from(plans)
          .where(and(eq(plans.name, planName), eq(plans.isActive, true)))
          .limit(1);
        if (!planRow) {
          throw new HttpException(
            'Selected plan is not available. Please refresh the page or contact support.',
            HttpStatus.BAD_REQUEST,
          );
        }
        planUuid = planRow.id;
      } else {
        const [planRow] = await tx
          .select({ id: plans.id })
          .from(plans)
          .where(and(eq(plans.id, planUuid), eq(plans.isActive, true)))
          .limit(1);
        if (!planRow) {
          throw new HttpException(
            'Invalid subscription plan',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      resolvedPlanId = planUuid;

      await tx
        .update(users)
        .set({
          passwordHash,
          status: ACCOUNT_STATUS.ACTIVE,
          isEmailVerified: true,
        })
        .where(eq(users.id, userId));

      await tx.insert(creatorPlans).values({
        id: randomUUID(),
        planId: planUuid,
        creatorId: userId,
      });

      await tx
        .update(usersToken)
        .set({ isUsed: true })
        .where(eq(usersToken.token, token));
    });

    const responseData = {
      userId,
      email: normalizedConfirmEmail,
      planId: resolvedPlanId ?? planId.trim(),
    };

    return success(
      responseData,
      'Creator account setup successfully',
      HttpStatus.CREATED,
    );
  } catch (error) {
    logger.error('Error setting up creator account:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Failed to setup creator account',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
