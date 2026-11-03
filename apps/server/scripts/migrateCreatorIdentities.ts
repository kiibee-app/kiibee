import 'dotenv/config';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';
import { db, pool } from '../src/database/db';
import {
  creatorChannels,
  creatorInfo,
  creatorOwners,
  users,
} from '../src/database/schema';
import { ensureCreatorChannel } from '../src/modules/auth/services/ensureCreatorChannel.service';
import { CREATOR_OWNERS } from './legacyCreatorOwners';
import { getAdminCreatorsService } from '../src/modules/creator/services/getAllExistingCreators.service';

// Dry run by default. Existing company URLs are retained when branding is unchanged.
async function main() {
  const apply = process.argv.includes('--apply');
  // Use the admin Owner column as the source of truth for legacy personal names.
  const adminOwners = new Map<string, string>();
  let page = 1;
  while (true) {
    const result = await getAdminCreatorsService({ page, limit: 100 });
    for (const creator of result.data.items) {
      if (creator.ownerName?.trim())
        adminOwners.set(creator.id, creator.ownerName.trim());
    }
    if (page >= result.data.pagination.totalPages) break;
    page += 1;
  }
  await db.transaction(async (tx) => {
    const rows = await tx
      .select({
        id: users.id,
        fullName: users.fullName,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        companyName: creatorInfo.companyName,
        channelName: creatorChannels.name,
        ownerName: creatorOwners.name,
        ownerFirst: creatorOwners.firstName,
        ownerLast: creatorOwners.lastName,
      })
      .from(users)
      .leftJoin(creatorInfo, eq(creatorInfo.userId, users.id))
      .leftJoin(creatorChannels, eq(creatorChannels.creatorId, users.id))
      .leftJoin(creatorOwners, eq(creatorOwners.creatorId, users.id))
      .where(eq(users.role, 'creator'));

    for (const row of rows) {
      const companyName =
        row.companyName?.trim() ||
        row.channelName?.trim() ||
        row.fullName?.trim() ||
        [row.firstName, row.lastName].filter(Boolean).join(' ').trim();
      if (!companyName) continue;
      const known = CREATOR_OWNERS.find((item) => {
        const pattern = item.channel.toLowerCase();
        const matches = (value?: string | null) =>
          pattern.includes('%')
            ? value?.toLowerCase().includes(pattern.replaceAll('%', ''))
            : value?.toLowerCase() === pattern;
        return (
          matches(companyName) ||
          matches(row.channelName) ||
          (item.email && item.email.toLowerCase() === row.email.toLowerCase())
        );
      });
      const ownerName =
        adminOwners.get(row.id) || row.ownerName?.trim() || known?.fullName;
      // Preserve known name parts only when they match the admin's owner name.
      const parts = ownerName?.split(/\s+/) || [];
      const existingPartsMatch =
        [row.ownerFirst, row.ownerLast].filter(Boolean).join(' ').trim() ===
        ownerName;
      const knownPartsMatch = known?.fullName === ownerName;
      const firstName = existingPartsMatch
        ? row.ownerFirst
        : knownPartsMatch
          ? known!.firstName
          : parts[0] || null;
      const lastName = existingPartsMatch
        ? row.ownerLast
        : knownPartsMatch
          ? known!.lastName
          : parts.slice(1).join(' ') || null;
      console.log(
        JSON.stringify({
          id: row.id,
          companyName,
          ownerName: ownerName || null,
        }),
      );
      if (!apply) continue;
      await tx
        .insert(creatorInfo)
        .values({ id: randomUUID(), userId: row.id, companyName })
        .onConflictDoUpdate({
          target: creatorInfo.userId,
          set: { companyName, updatedAt: new Date() },
        });
      if (ownerName) {
        await tx
          .insert(creatorOwners)
          .values({
            id: randomUUID(),
            creatorId: row.id,
            name: ownerName,
            firstName,
            lastName,
            email: row.email,
          })
          .onConflictDoUpdate({
            target: creatorOwners.creatorId,
            set: {
              name: ownerName,
              firstName,
              lastName,
              updatedAt: new Date(),
            },
          });
        await tx
          .update(users)
          .set({
            firstName,
            lastName,
            fullName: ownerName,
            updatedAt: new Date(),
          })
          .where(eq(users.id, row.id));
      }
      await ensureCreatorChannel(tx, {
        creatorId: row.id,
        channelName: companyName,
        publish: false,
      });
    }
    console.log(`${apply ? 'Migrated' : 'Previewed'} ${rows.length} creators`);
  });
}
main()
  .finally(() => pool.end())
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
