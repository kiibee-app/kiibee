import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq, ne } from 'drizzle-orm';
import { db } from 'src/database/db';
import { users } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { ROLE } from 'src/utils/constant';
import { fail, success } from 'src/utils/sendResponse';

export const updateCreatorSequenceService = async (
  creatorId: string,
  sequence?: number | null,
) => {
  try {
    const [creator] = await db
      .select({
        id: users.id,
        sequence: users.sequence,
      })
      .from(users)
      .where(
        and(
          eq(users.id, creatorId),
          eq(users.role, ROLE.CREATOR),
          eq(users.isDeleted, false),
        ),
      )
      .limit(1);

    if (!creator) {
      return fail('Creator not found', HttpStatus.NOT_FOUND);
    }

    const nextSequence =
      sequence === undefined ||
      sequence === null ||
      (typeof sequence === 'string' &&
        (sequence as unknown as string).trim() === '')
        ? null
        : Number(sequence);

    if (
      nextSequence !== null &&
      (!Number.isInteger(nextSequence) ||
        nextSequence < 1 ||
        nextSequence > 1000)
    ) {
      return fail(
        'Sequence must be an integer between 1 and 1000',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (nextSequence !== null) {
      const [duplicate] = await db
        .select({
          id: users.id,
          fullName: users.fullName,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
        })
        .from(users)
        .where(
          and(
            ne(users.id, creatorId),
            eq(users.sequence, nextSequence),
            eq(users.role, ROLE.CREATOR),
            eq(users.isDeleted, false),
          ),
        )
        .limit(1);

      if (duplicate) {
        const creatorName =
          duplicate.fullName?.trim() ||
          [duplicate.firstName, duplicate.lastName]
            .filter(Boolean)
            .join(' ')
            .trim() ||
          duplicate.email;

        return fail(
          `Sequence #${nextSequence} is already assigned to "${creatorName}"`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const [updated] = await db
      .update(users)
      .set({ sequence: nextSequence, updatedAt: new Date() })
      .where(eq(users.id, creatorId))
      .returning({
        id: users.id,
        sequence: users.sequence,
      });

    return success(
      updated,
      nextSequence !== null
        ? `Creator sequence set to ${nextSequence}`
        : 'Creator sequence removed',
    );
  } catch (error) {
    logger.error('Error updating creator sequence:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Failed to update creator sequence',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
