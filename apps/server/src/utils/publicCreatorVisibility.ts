import { HttpStatus } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import { contentSettings, mediaFiles, users } from 'src/database/schema';
import { ROLE } from 'src/utils/constant';
import { fail } from 'src/utils/sendResponse';

export const publiclyVisibleCreatorWhere = eq(users.isHidden, false);

export const creatorContentIsDiscoverable = sql`(
  ${mediaFiles.accessType} NOT IN ('password', 'email_gated')
  AND NOT EXISTS (
    SELECT 1
    FROM ${contentSettings}
    WHERE ${contentSettings.userId} = ${mediaFiles.creatorId}
      AND ${contentSettings.accessType} IN ('set_password', 'request_email', 'password', 'email_gated')
  )
)`;

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
