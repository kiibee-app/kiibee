import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { and, eq } from 'drizzle-orm';

import { db } from 'src/database/db';
import { users, userSessions } from 'src/database/schema';
import { success } from 'src/utils/sendResponse';
import { ViewerSignUpDto } from '../dto/viewerSignUp.dto';
import { hashPassword } from 'src/utils/passwordHash';
import { ROLE } from 'src/utils/constant';

export const viewerSignUpService = async (
  viewerData: ViewerSignUpDto,
  refreshToken?: string,
  ipAddress?: string,
  userAgent?: string,
) => {
  const { fullName, email, password, confirmPassword } = viewerData;

  const trimmedFullName = fullName?.trim();
  const normalizedEmail = email?.toLowerCase().trim();

  if (!trimmedFullName || !normalizedEmail || !password || !confirmPassword) {
    throw new HttpException('All fields are required', HttpStatus.BAD_REQUEST);
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

  const existingUser = await db.query.users.findFirst({
    where: and(eq(users.email, normalizedEmail), eq(users.isDeleted, false)),
    columns: {
      id: true,
    },
  });

  if (existingUser) {
    throw new HttpException('Email already exists', HttpStatus.CONFLICT);
  }

  const passwordHash = await hashPassword(password);

  const newUser: typeof users.$inferInsert = {
    id: randomUUID(),
    fullName: trimmedFullName,
    email: normalizedEmail,
    passwordHash,
    role: ROLE.VIEWER,
    isEmailVerified: true,
  };

  const [createdUser] = await db.insert(users).values(newUser).returning({
    id: users.id,
    fullName: users.fullName,
    email: users.email,
    role: users.role,
    isEmailVerified: users.isEmailVerified,
    avatarUrl: users.avatarUrl,
    createdAt: users.createdAt,
  });

  if (refreshToken) {
    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);
    const sessionId = randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await db.insert(userSessions).values({
      id: sessionId,
      userId: createdUser.id,
      refreshTokenHash,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      expiresAt,
    });
  }

  return success(
    createdUser,
    'User registered successfully',
    HttpStatus.CREATED,
  );
};
