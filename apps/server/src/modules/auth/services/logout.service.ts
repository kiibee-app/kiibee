import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';

import { db } from 'src/database/db';
import { userSessions } from 'src/database/schema';
import { success } from 'src/utils/sendResponse';

export const logoutService = async (
  userId: string,
  refreshToken?: string,
  ipAddress?: string,
  userAgent?: string,
) => {
  if (refreshToken) {
    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);
    const sessionId = randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await db.insert(userSessions).values({
      id: sessionId,
      userId,
      refreshTokenHash,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      expiresAt,
    });
  }

  return success(null, 'Logged out successfully', 200);
};

export const invalidateSession = async (userId: string) => {
  await db.delete(userSessions).where(eq(userSessions.userId, userId));

  return success(null, 'Session invalidated', 200);
};
