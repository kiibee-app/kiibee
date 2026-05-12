import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  index,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { mediaFiles } from '../content/mediaFiles.schema';

export const storageProviderEnum = pgEnum('storage_provider', [
  'do_spaces',
  'cloudflare_stream',
  'cloudflare_r2',
  'cloudflare_cdn',
]);

/**
 * Tracks every file stored in cloud storage.
 * During migration: Cloudflare files are copied to DigitalOcean Spaces,
 * with the original URL preserved in migrated_from_url.
 *
 * A media_file can have multiple storage entries (e.g. main file + thumbnail + trailer).
 */
export const cloudStorageFiles = pgTable(
  'cloud_storage_files',
  {
    id: text('id').primaryKey(),
    mediaFileId: text('media_file_id').references(() => mediaFiles.id, {
      onDelete: 'set null',
    }),

    storageProvider: storageProviderEnum('storage_provider').notNull(),
    bucket: varchar('bucket', { length: 255 }).notNull(),
    storageKey: text('storage_key').notNull(),
    originalFilename: varchar('original_filename', { length: 500 }),
    contentType: varchar('content_type', { length: 255 }),
    fileSize: integer('file_size'),

    cdnUrl: text('cdn_url'),

    // Cloudflare-specific
    cloudflareFileId: text('cloudflare_file_id'),

    // Migration tracking
    isMigrated: boolean('is_migrated').notNull().default(false),
    migratedFromUrl: text('migrated_from_url'),
    migratedAt: timestamp('migrated_at', { withTimezone: true }),

    // File purpose within a media_file (main, thumbnail, trailer)
    purpose: varchar('purpose', { length: 30 }).notNull().default('main'),

    ...baseTimestamps,
  },
  (table) => ({
    mediaFileIdIdx: index('cloud_storage_files_media_file_id_idx').on(
      table.mediaFileId,
    ),
    storageProviderIdx: index('cloud_storage_files_provider_idx').on(
      table.storageProvider,
    ),
    storageKeyIdx: index('cloud_storage_files_storage_key_idx').on(
      table.storageKey,
    ),
    isMigratedIdx: index('cloud_storage_files_is_migrated_idx').on(
      table.isMigrated,
    ),
    purposeIdx: index('cloud_storage_files_purpose_idx').on(table.purpose),
  }),
);
