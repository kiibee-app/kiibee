import 'dotenv/config';
import { randomUUID } from 'crypto';
import { eq, sql } from 'drizzle-orm';
import { mkdirSync, openSync, closeSync, chmodSync } from 'fs';
import { resolve } from 'path';
import { spawnSync } from 'child_process';
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

async function prepareLiveDatabase() {
  // Back up before schema or data changes. Credentials stay out of command arguments.
  const url = new URL(process.env.DATABASE_URL!);
  const backupDir = resolve(process.env.CREATOR_BACKUP_DIR || '.backups');
  mkdirSync(backupDir, { recursive: true, mode: 0o700 });
  const backupPath = resolve(backupDir, `creator-identities-${Date.now()}.sql`);
  const ownerTable = await db.execute(
    sql`select to_regclass('public.creator_owners') as name`,
  );
  const tables = [
    'users',
    'creator_info',
    'creator_channels',
    'creator_application_requests',
  ];
  if (ownerTable.rows[0]?.name) tables.push('creator_owners');
  const fd = openSync(backupPath, 'wx', 0o600);
  let backup;
  try {
    backup = spawnSync(
      'pg_dump',
      ['--data-only', ...tables.flatMap((table) => ['--table', table])],
      {
        env: {
          ...process.env,
          PGHOST: url.hostname,
          PGPORT: url.port || '5432',
          PGDATABASE: decodeURIComponent(url.pathname.slice(1)),
          PGUSER: decodeURIComponent(url.username),
          PGPASSWORD: decodeURIComponent(url.password),
          PGCONNECT_TIMEOUT: '15',
          ...(url.searchParams.get('sslmode')
            ? { PGSSLMODE: url.searchParams.get('sslmode')! }
            : {}),
        },
        stdio: ['ignore', fd, 'pipe'],
        encoding: 'utf8',
      },
    );
  } finally {
    closeSync(fd);
  }
  chmodSync(backupPath, 0o600);
  if (backup.error || backup.status !== 0) {
    throw new Error(
      `Database backup failed; no data changed. Install a compatible pg_dump. ${backup.error?.message || backup.stderr}`,
    );
  }
  console.log(`Backup saved: ${backupPath}`);
  await db.transaction(async (tx) => {
    await tx.execute(
      sql`ALTER TABLE creator_application_requests ADD COLUMN IF NOT EXISTS company_name varchar(200)`,
    );
    await tx.execute(sql`CREATE TABLE IF NOT EXISTS creator_owners (
      id text PRIMARY KEY NOT NULL,
      creator_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name varchar(255) NOT NULL, first_name varchar(255), last_name varchar(255),
      email varchar(255), phone varchar(50),
      created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
    )`);
    await tx.execute(
      sql`CREATE UNIQUE INDEX IF NOT EXISTS creator_owners_creator_id_unique ON creator_owners(creator_id)`,
    );
    await tx.execute(
      sql`CREATE INDEX IF NOT EXISTS creator_owners_name_idx ON creator_owners(name)`,
    );
  });
}

// Dry run by default. --apply backs up, prepares the schema, then migrates atomically.
async function main() {
  const apply = process.argv.includes('--apply');
  if (apply) await prepareLiveDatabase();
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
      const knownPartsMatch = Boolean(
        known && ownerName && known.fullName === ownerName,
      );
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
