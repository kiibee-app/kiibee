import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';

import { db } from 'src/database/db';
import { userSessions } from 'src/database/schema';

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

  await db.transaction(async (tx) => {
    await tx.delete(userSessions).where(eq(userSessions.userId, userId));

    await tx.insert(userSessions).values({
      id: sessionId,
      userId,
      refreshTokenHash,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      expiresAt,
    });
  });
};
