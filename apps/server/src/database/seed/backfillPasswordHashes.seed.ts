import { isNull } from 'drizzle-orm';

import { hashPassword } from 'src/utils/passwordHash';

import { db } from '../db';
import { users } from '../schema';

export async function backfillMissingPasswordHashes() {
  const passwordHash =
    process.env.CREATOR_SEED_PASSWORD_HASH?.trim() ||
    (await hashPassword('123456'));

  const updated = await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(isNull(users.passwordHash))
    .returning({ id: users.id });

  if (updated.length > 0) {
    console.log(
      `Backfilled password hash for ${updated.length} users without one`,
    );
  }
}
