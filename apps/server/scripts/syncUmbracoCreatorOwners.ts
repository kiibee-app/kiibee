import 'dotenv/config';
import { randomUUID } from 'crypto';
import { eq, ilike, or, sql } from 'drizzle-orm';
import { db } from '../src/database/db';
import { creatorChannels, creatorOwners, users } from '../src/database/schema';

import { CREATOR_OWNERS } from './legacyCreatorOwners';

async function ensureCreatorOwnersTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "creator_owners" (
      "id" text PRIMARY KEY NOT NULL,
      "creator_id" text NOT NULL REFERENCES "users"("id") ON DELETE cascade,
      "name" varchar(255) NOT NULL,
      "first_name" varchar(255),
      "last_name" varchar(255),
      "email" varchar(255),
      "phone" varchar(50),
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp with time zone DEFAULT now() NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS "creator_owners_creator_id_unique" ON "creator_owners" ("creator_id");
    CREATE INDEX IF NOT EXISTS "creator_owners_name_idx" ON "creator_owners" ("name");
  `);
}

async function main() {
  console.log('Ensuring creator_owners table exists...');
  await ensureCreatorOwnersTable();

  console.log('Starting creator owners sync to creator_owners table...');
  const now = new Date();

  // 1. Sync specific known brand creators
  for (const item of CREATOR_OWNERS) {
    const filters = [ilike(creatorChannels.name, item.channel)];
    if (item.email) {
      filters.push(ilike(users.email, item.email));
    }

    const matchedUsers = await db
      .select({
        id: users.id,
        email: users.email,
        channelName: creatorChannels.name,
        currentFullName: users.fullName,
      })
      .from(users)
      .leftJoin(creatorChannels, eq(creatorChannels.creatorId, users.id))
      .where(or(...filters));

    for (const u of matchedUsers) {
      // Upsert into creator_owners
      await db
        .insert(creatorOwners)
        .values({
          id: randomUUID(),
          creatorId: u.id,
          name: item.fullName,
          firstName: item.firstName,
          lastName: item.lastName,
          email: item.email ?? u.email,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: creatorOwners.creatorId,
          set: {
            name: item.fullName,
            firstName: item.firstName,
            lastName: item.lastName,
            email: item.email ?? u.email,
            updatedAt: now,
          },
        });

      // Also update users table
      await db
        .update(users)
        .set({
          firstName: item.firstName,
          lastName: item.lastName,
          fullName: item.fullName,
          updatedAt: now,
        })
        .where(eq(users.id, u.id));

      console.log(
        `Synced creator_owners for ${u.email} (${u.channelName}): '${item.fullName}'`,
      );
    }
  }

  // 2. For any other creators without a creator_owners record, populate from their user record
  const allCreatorsWithoutOwner = await db
    .select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      fullName: users.fullName,
      channelName: creatorChannels.name,
      ownerId: creatorOwners.id,
    })
    .from(users)
    .leftJoin(creatorChannels, eq(creatorChannels.creatorId, users.id))
    .leftJoin(creatorOwners, eq(creatorOwners.creatorId, users.id))
    .where(eq(users.role, 'creator'));

  for (const c of allCreatorsWithoutOwner) {
    if (!c.ownerId) {
      const fallbackName =
        c.fullName?.trim() ||
        [c.firstName, c.lastName].filter(Boolean).join(' ').trim() ||
        c.channelName?.trim() ||
        c.email;

      await db
        .insert(creatorOwners)
        .values({
          id: randomUUID(),
          creatorId: c.id,
          name: fallbackName,
          firstName: c.firstName,
          lastName: c.lastName,
          email: c.email,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoNothing({ target: creatorOwners.creatorId });

      console.log(
        `Initialized default creator_owners for ${c.email}: '${fallbackName}'`,
      );
    }
  }

  console.log('Creator owners sync completed successfully.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Error during owner sync:', err);
  process.exit(1);
});
