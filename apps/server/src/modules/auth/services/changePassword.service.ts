import * as bcrypt from 'bcrypt';
import { HttpStatus } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { users, userSessions } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { hashPassword } from 'src/utils/passwordHash';
import { fail, success } from 'src/utils/sendResponse';
import { ChangePasswordDto } from '../dto/changePassword.dto';

export const changePasswordService = async (
  userId: string,
  dto: ChangePasswordDto,
) => {
  const { currentPassword, password, confirmPassword } = dto;

  if (!currentPassword || !password || !confirmPassword) {
    return fail('All fields are required', HttpStatus.BAD_REQUEST);
  }

  if (password !== confirmPassword) {
    return fail('Passwords do not match', HttpStatus.BAD_REQUEST);
  }

  if (password.length < 6) {
    return fail(
      'Password must be at least 6 characters',
      HttpStatus.BAD_REQUEST,
    );
  }

  try {
    return await db.transaction(async (tx) => {
      const [user] = await tx
        .select({
          id: users.id,
          passwordHash: users.passwordHash,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user?.passwordHash) {
        return fail('User not found', HttpStatus.NOT_FOUND);
      }

      const currentOk = await bcrypt.compare(
        currentPassword,
        user.passwordHash,
      );

      if (!currentOk) {
        return fail('Current password is incorrect', HttpStatus.UNAUTHORIZED);
      }

      const sameAsOld = await bcrypt.compare(password, user.passwordHash);
      if (sameAsOld) {
        return fail(
          'New password must be different from your current password',
          HttpStatus.BAD_REQUEST,
        );
      }

      const newPasswordHash = await hashPassword(password);

      await tx
        .update(users)
        .set({ passwordHash: newPasswordHash })
        .where(eq(users.id, userId));

      await tx.delete(userSessions).where(eq(userSessions.userId, userId));

      return success(null, 'Password updated successfully', HttpStatus.OK);
    });
  } catch (error) {
    logger.error('Error in changePasswordService:', error);
    return fail('Failed to update password', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};
