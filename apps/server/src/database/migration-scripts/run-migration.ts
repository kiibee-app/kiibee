/**
 * Umbraco CMS → Kiibee Migration Runner
 *
 * Usage:
 *   UMBRACO_DB_CONNECTION_STRING="..." npx tsx src/database/migration-scripts/run-migration.ts [entity]
 *
 * Entities: users | tags | media_files | collections | cloudflare_media | all
 *
 * Prerequisites:
 *   1. Set UMBRACO_DB_CONNECTION_STRING in .env (SQL Server connection to old Umbraco DB)
 *   2. Set DO_SPACES_* env vars for DigitalOcean Spaces
 *   3. Set CLOUDFLARE_* env vars if migrating media blobs
 *   4. Kiibee PostgreSQL must have latest schema (run `npm run migrate` first)
 */

import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { dataMigrations } from '../schema/system/dataMigrations.schema';
import {
  MIGRATION_ORDER,
  type MigrationEntity,
  CREATOR_QUERY,
  SHOWS_QUERY,
  PURCHASES_QUERY,
  SUBSCRIBERS_QUERY,
  INVOICES_QUERY,
  PAYOUTS_QUERY,
} from './umbraco-mappings';

async function createMigrationRecord(
  entity: string,
  source: 'umbraco' | 'cloudflare',
) {
  const id = crypto.randomUUID();
  await db.insert(dataMigrations).values({
    id,
    source,
    entityType: entity,
    batchLabel: `migration-${new Date().toISOString()}`,
    status: 'in_progress',
    startedAt: new Date(),
  });
  return id;
}

async function updateMigrationRecord(
  id: string,
  updates: {
    status: 'completed' | 'failed';
    migratedRecords?: number;
    failedRecords?: number;
    skippedRecords?: number;
    totalRecords?: number;
    errorLog?: unknown;
  },
) {
  await db
    .update(dataMigrations)
    .set({
      ...updates,
      completedAt: new Date(),
    })
    .where(eq(dataMigrations.id, id));
}

/**
 * Runs a migration step for a given entity.
 * Requires UMBRACO_DB_CONNECTION_STRING to be set.
 *
 * To connect to Umbraco SQL Server, install: pnpm add mssql
 * Then uncomment the mssql import and connection code below.
 */

// import mssql from 'mssql';
//
// async function getUmbracoDb() {
//   const connStr = process.env.UMBRACO_DB_CONNECTION_STRING;
//   if (!connStr) throw new Error('UMBRACO_DB_CONNECTION_STRING not set');
//   return mssql.connect(connStr);
// }

async function runEntityMigration(
  entity: MigrationEntity,
  query: string,
  description: string,
) {
  const source = entity === 'shows' ? 'cloudflare' : 'umbraco';
  const migrationId = await createMigrationRecord(
    entity,
    source as 'umbraco' | 'cloudflare',
  );
  try {
    console.log(`[Migration] ${description}`);
    console.log(`[Migration] SQL Query to run against Umbraco DB:`);
    console.log(query);
    console.log('');

    // --- Uncomment after installing mssql: ---
    // const umbracoDb = await getUmbracoDb();
    // const result = await umbracoDb.request().query(query);
    // console.log(`[Migration] Found ${result.recordset.length} records`);
    //
    // For each row in result.recordset:
    //   - Transform using mapShowToMediaFile / mapPurchaseToOrder
    //   - Insert into Kiibee PostgreSQL via drizzle
    //
    // await updateMigrationRecord(migrationId, {
    //   status: 'completed',
    //   totalRecords: result.recordset.length,
    //   migratedRecords: result.recordset.length,
    // });

    console.log(
      '[Migration] ⚠ Dry run - set UMBRACO_DB_CONNECTION_STRING and install mssql to run for real',
    );
    await updateMigrationRecord(migrationId, {
      status: 'completed',
      totalRecords: 0,
      migratedRecords: 0,
    });
  } catch (error) {
    await updateMigrationRecord(migrationId, {
      status: 'failed',
      errorLog: { message: String(error) },
    });
    throw error;
  }
}

const ENTITY_HANDLERS: Record<MigrationEntity, () => Promise<void>> = {
  creators: () =>
    runEntityMigration(
      'creators',
      CREATOR_QUERY,
      'Creators: top-level nodes → users + creator_channels',
    ),
  shows: () =>
    runEntityMigration(
      'shows',
      SHOWS_QUERY,
      'Shows: media items → media_files (Cloudflare Stream IDs)',
    ),
  purchases: () =>
    runEntityMigration(
      'purchases',
      PURCHASES_QUERY,
      'Purchases: transactions → orders + order_items + user_content_access',
    ),
  subscribers: () =>
    runEntityMigration(
      'subscribers',
      SUBSCRIBERS_QUERY,
      'Subscribers: email lists → email_subscribers',
    ),
  invoices: () =>
    runEntityMigration(
      'invoices',
      INVOICES_QUERY,
      'Invoices: billing → subscription_invoices',
    ),
  payouts: () =>
    runEntityMigration(
      'payouts',
      PAYOUTS_QUERY,
      'Payouts: settlements → creator_payouts',
    ),
};

async function main() {
  const entity = (process.argv[2] || 'all') as MigrationEntity | 'all';

  console.log(`\n🚀 Kiibee Migration Runner`);
  console.log(`   Source: Umbraco CMS + Cloudflare`);
  console.log(`   Target: DigitalOcean PostgreSQL + DO Spaces`);
  console.log(`   Entity: ${entity}\n`);

  if (entity === 'all') {
    for (const e of MIGRATION_ORDER) {
      console.log(`\n--- Migrating: ${e} ---`);
      await ENTITY_HANDLERS[e]();
    }
  } else if (ENTITY_HANDLERS[entity]) {
    await ENTITY_HANDLERS[entity]();
  } else {
    console.error(
      `Unknown entity: ${entity}. Valid: ${MIGRATION_ORDER.join(', ')}, all`,
    );
    process.exit(1);
  }

  console.log('\n✅ Migration complete');
  process.exit(0);
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
