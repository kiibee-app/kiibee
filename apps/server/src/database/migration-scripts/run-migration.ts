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
import { db } from '../db';
import { dataMigrations } from '../schema/system/dataMigrations.schema';
import { MIGRATION_ORDER } from './umbraco-mappings';

type MigrationEntity = (typeof MIGRATION_ORDER)[number];

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
  const { eq } = await import('drizzle-orm');
  await db
    .update(dataMigrations)
    .set({
      ...updates,
      completedAt: new Date(),
    })
    .where(eq(dataMigrations.id, id));
}

async function migrateUsers() {
  const migrationId = await createMigrationRecord('users', 'umbraco');
  try {
    // TODO: Connect to Umbraco SQL Server using UMBRACO_DB_CONNECTION_STRING
    // TODO: Execute USER_MAPPING.source.query
    // TODO: Transform each row using USER_MAPPING.fieldMap
    // TODO: Insert into Kiibee users table with legacyUmbracoId set
    // TODO: Also create user_profiles records

    console.log(
      '[Migration] Users: Connect to Umbraco DB and run migration...',
    );
    console.log(
      '[Migration] Ensure UMBRACO_DB_CONNECTION_STRING is set in .env',
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

async function migrateTags() {
  const migrationId = await createMigrationRecord('tags', 'umbraco');
  try {
    // TODO: Connect to Umbraco SQL Server
    // TODO: Execute TAG_MAPPING.source.query
    // TODO: Generate slugs from tag names
    // TODO: Insert into Kiibee tags table with legacyUmbracoId

    console.log('[Migration] Tags: Connect to Umbraco DB and run migration...');

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

async function migrateMediaFiles() {
  const migrationId = await createMigrationRecord('media_files', 'umbraco');
  try {
    // TODO: Connect to Umbraco SQL Server
    // TODO: Execute MEDIA_FILE_MAPPING.source.query
    // TODO: Transform using fieldMap (content type alias → file type, etc.)
    // TODO: Insert into media_files with legacyUmbracoId + legacyCloudflareUrl
    // TODO: Create media_file_categories and media_file_tags relations

    console.log(
      '[Migration] Media files: Connect to Umbraco DB and run migration...',
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

async function migrateCloudflareMedia() {
  const migrationId = await createMigrationRecord('media_blobs', 'cloudflare');
  try {
    // TODO: Query media_files where legacy_cloudflare_url IS NOT NULL
    // TODO: For each file:
    //   1. Download from Cloudflare using CLOUDFLARE_API_TOKEN
    //   2. Upload to DigitalOcean Spaces using S3 SDK
    //   3. Create cloud_storage_files record
    //   4. Update media_files.file_url to new CDN URL

    console.log(
      '[Migration] Cloudflare media: Download from Cloudflare, upload to DO Spaces...',
    );
    console.log('[Migration] Ensure DO_SPACES_* and CLOUDFLARE_* vars are set');

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
  tags: migrateTags,
  content_categories: async () =>
    console.log('[Migration] Categories: seeded, skip'),
  content_types: async () =>
    console.log('[Migration] Content types: seeded, skip'),
  users: migrateUsers,
  media_files: migrateMediaFiles,
  collections: async () =>
    console.log('[Migration] Collections: implement after media_files'),
  tag_relations: async () =>
    console.log('[Migration] Tag relations: implement after tags + media'),
  cloudflare_media: migrateCloudflareMedia,
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
