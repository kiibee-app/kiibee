import { eq } from 'drizzle-orm';

import { db } from 'src/database/db';
import { userSessions } from 'src/database/schema';
import { success } from 'src/utils/sendResponse';

export const logoutService = async (userId: string) => {
  await db.delete(userSessions).where(eq(userSessions.userId, userId));

  return success(null, 'Logged out successfully', 200);
};

export const invalidateSession = async (userId: string) => {
  await db.delete(userSessions).where(eq(userSessions.userId, userId));

  return success(null, 'Session invalidated', 200);
};
