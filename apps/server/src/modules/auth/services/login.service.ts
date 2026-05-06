import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { users, userSessions } from 'src/database/schema';
import { success, fail } from 'src/utils/sendResponse';
import { LoginDto } from '../dto/login.dto';
import { HttpStatus } from '@nestjs/common';

export const loginService = async (
  loginData: LoginDto,
  refreshToken: string,
  ipAddress?: string,
  userAgent?: string,
) => {
  const { email, password } = loginData;

  const normalizedEmail = email?.toLowerCase().trim();

  if (!normalizedEmail || !password) {
    return fail('Email and password are required', HttpStatus.BAD_REQUEST);
  }

  const user = await db.query.users.findFirst({
    where: and(eq(users.email, normalizedEmail), eq(users.isDeleted, false)),
    columns: {
      id: true,
      fullName: true,
      email: true,
      passwordHash: true,
      role: true,
      isEmailVerified: true,
      status: true,
    },
  });

  if (!user) {
    return fail('Invalid email or password', 401);
  }

  if (user.status !== 'active') {
    return fail('Account is not active', HttpStatus.FORBIDDEN);
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash!);

  if (!isPasswordValid) {
    return fail('Invalid email or password', HttpStatus.UNAUTHORIZED);
  }

  const refreshTokenHash = await bcrypt.hash(refreshToken, 12);
  const sessionId = randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await db.insert(userSessions).values({
    id: sessionId,
    userId: user.id,
    refreshTokenHash,
    ipAddress: ipAddress || null,
    userAgent: userAgent || null,
    expiresAt,
  });

  const { passwordHash, ...userWithoutPassword } = user;

  return success(
    userWithoutPassword,
    'Login successful',
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
};
