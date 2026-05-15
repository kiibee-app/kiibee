import {
  pgTable,
  text,
  varchar,
  integer,
  jsonb,
  timestamp,
  index,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';

export const migrationSourceEnum = pgEnum('migration_source', [
  'umbraco',
  'cloudflare',
]);

export const migrationStatusEnum = pgEnum('migration_status', [
  'pending',
  'in_progress',
  'completed',
  'failed',
  'rolled_back',
]);

/**
 * Tracks each batch of data migrated from Umbraco CMS / Cloudflare.
 * One row per entity type per migration run.
 *
 * Umbraco mapping:
 *  - entity_type 'users'       → umbracoUser + cmsMember
 *  - entity_type 'media_files' → cmsContent + cmsDocument + cmsPropertyData
 *  - entity_type 'collections' → cmsContent (grouped nodes)
 *  - entity_type 'tags'        → cmsTags
 *  - entity_type 'categories'  → cmsTags (group-based)
 *  - entity_type 'media_blobs' → Cloudflare R2/CDN → DigitalOcean Spaces
 */
export const dataMigrations = pgTable(
  'data_migrations',
  {
    id: text('id').primaryKey(),

    source: migrationSourceEnum('source').notNull(),
    entityType: varchar('entity_type', { length: 100 }).notNull(),
    batchLabel: varchar('batch_label', { length: 255 }),

    status: migrationStatusEnum('status').notNull().default('pending'),

    totalRecords: integer('total_records').notNull().default(0),
    migratedRecords: integer('migrated_records').notNull().default(0),
    skippedRecords: integer('skipped_records').notNull().default(0),
    failedRecords: integer('failed_records').notNull().default(0),

    errorLog: jsonb('error_log'),
    metadata: jsonb('metadata'),

    startedAt: timestamp('started_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),

    ...baseTimestamps,
  },
  (table) => ({
    sourceIdx: index('data_migrations_source_idx').on(table.source),
    entityTypeIdx: index('data_migrations_entity_type_idx').on(
      table.entityType,
    ),
    statusIdx: index('data_migrations_status_idx').on(table.status),
    sourceEntityIdx: index('data_migrations_source_entity_idx').on(
      table.source,
      table.entityType,
    ),
  }),
);
