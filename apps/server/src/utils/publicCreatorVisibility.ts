import { HttpStatus } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { users } from 'src/database/schema';
import { ROLE } from 'src/utils/constant';
import { fail } from 'src/utils/sendResponse';

export const publiclyVisibleCreatorWhere = eq(users.isHidden, false);

export const requirePubliclyVisibleCreator = async (creatorId: string) => {
  const [creator] = await db
    .select({
      id: users.id,
      isHidden: users.isHidden,
      isDeleted: users.isDeleted,
    })
    .from(users)
    .where(and(eq(users.id, creatorId), eq(users.role, ROLE.CREATOR)))
    .limit(1);

  if (!creator || creator.isDeleted || creator.isHidden) {
    return fail('Creator not found', HttpStatus.NOT_FOUND);
  }

  return creator;
};
