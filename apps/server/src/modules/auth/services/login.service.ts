import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { users, userSessions } from 'src/database/schema';
import { success } from 'src/utils/sendResponse';
import { LoginDto } from '../dto/login.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { STATUS } from 'src/utils/constant';

export const loginService = async (
  loginData: LoginDto,
  refreshToken: string,
  ipAddress?: string,
  userAgent?: string,
) => {
  const { email, password } = loginData;

  const normalizedEmail = email?.toLowerCase().trim();

  if (!normalizedEmail || !password) {
    throw new HttpException('Email and password are required', 400);
  }

  return await db.transaction(async (tx) => {
    const user = await tx.query.users.findFirst({
      where: and(eq(users.email, normalizedEmail), eq(users.isDeleted, false)),
      columns: {
        id: true,
        fullName: true,
        email: true,
        passwordHash: true,
        role: true,
        isEmailVerified: true,
        status: true,
        avatarUrl: true,
      },
    });

    if (!user) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const allowedStatuses: string[] = [STATUS.ACTIVE, STATUS.PENDING_SETUP];

    if (!allowedStatuses.includes(user.status)) {
      throw new HttpException('Account is not active', HttpStatus.FORBIDDEN);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash!);

    if (!isPasswordValid) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (refreshToken) {
      const refreshTokenHash = await bcrypt.hash(refreshToken, 12);
      const sessionId = randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await tx.delete(userSessions).where(eq(userSessions.userId, user.id));

      await tx.insert(userSessions).values({
        id: sessionId,
        userId: user.id,
        refreshTokenHash,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
        expiresAt,
      });
    }

    const userWithoutPassword = Object.fromEntries(
      Object.entries(user).filter(([key]) => key !== 'passwordHash'),
    ) as Omit<typeof user, 'passwordHash'>;

    return success(userWithoutPassword, 'Login successful', HttpStatus.OK);
  });
};
