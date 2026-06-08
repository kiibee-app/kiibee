import { HttpStatus } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

import { db } from 'src/database/db';
import { users } from 'src/database/schema';
import { fail, success } from 'src/utils/sendResponse';

export const getViewerProfileService = async (userId: string, role: string) => {
  const user = await db.query.users.findFirst({
    where: and(eq(users.id, userId), eq(users.isDeleted, false)),
    columns: {
      id: true,
      firstName: true,
      lastName: true,
      fullName: true,
      email: true,
      avatarUrl: true,
      role: true,
      isEmailVerified: true,
      isActive: true,
      status: true,
    },
  });

  if (!user) {
    return fail('User not found', HttpStatus.NOT_FOUND);
  }

  return success(
    {
      ...user,
      downloadsCount: role === 'viewer' ? 0 : undefined,
    },
    'Profile fetched successfully',
  );
};
