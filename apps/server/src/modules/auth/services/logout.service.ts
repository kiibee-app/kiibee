import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';

import { db } from 'src/database/db';
import { userSessions } from 'src/database/schema';
import { success } from 'src/utils/sendResponse';
import { revokeAccessToken } from './token-denylist.service';

export const createSessionService = async (
  userId: string,
  refreshToken: string,
  ipAddress?: string,
  userAgent?: string,
) => {
  const refreshTokenHash = await bcrypt.hash(refreshToken, 12);
  const sessionId = randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await db.delete(userSessions).where(eq(userSessions.userId, userId));

  await db.insert(userSessions).values({
    id: sessionId,
    userId,
    refreshTokenHash,
    ipAddress: ipAddress || null,
    userAgent: userAgent || null,
    expiresAt,
  });

  return success(null, 'Session created', 201);
};

export const logoutService = async (
  userId: string,
  jti?: string,
  exp?: number,
) => {
  await db.delete(userSessions).where(eq(userSessions.userId, userId));

  if (jti && exp) {
    const expiresAt = new Date(exp * 1000);
    await revokeAccessToken(jti, expiresAt);
  }

  return success(null, 'Logged out successfully', 200);
};

export const invalidateSession = async (
  userId: string,
  jti?: string,
  exp?: number,
) => {
  await db.delete(userSessions).where(eq(userSessions.userId, userId));

  if (jti && exp) {
    const expiresAt = new Date(exp * 1000);
    await revokeAccessToken(jti, expiresAt);
  }

  return success(null, 'Session invalidated', 200);
};
