import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';

import { db } from 'src/database/db';
import { userSessions } from 'src/database/schema';
import { success } from 'src/utils/sendResponse';

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

export const logoutService = async (userId: string) => {
  await db.delete(userSessions).where(eq(userSessions.userId, userId));
  return success(null, 'Logged out successfully', 200);
};

export const invalidateSession = async (userId: string) => {
  await db.delete(userSessions).where(eq(userSessions.userId, userId));

  return success(null, 'Session invalidated', 200);
};
