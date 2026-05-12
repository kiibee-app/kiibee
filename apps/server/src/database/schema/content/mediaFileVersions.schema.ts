import { pgTable, text, integer, index } from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { mediaFiles } from './mediaFiles.schema';
import { users } from '../users/users.schema';

export const mediaFileVersions = pgTable(
  'media_file_versions',
  {
    id: text('id').primaryKey(),
    mediaFileId: text('media_file_id')
      .notNull()
      .references(() => mediaFiles.id, { onDelete: 'cascade' }),

    versionNumber: integer('version_number').notNull(),
    fileUrl: text('file_url').notNull(),
    fileSize: integer('file_size'),

    changedBy: text('changed_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    changeNote: text('change_note'),

    ...baseTimestamps,
  },
  (table) => ({
    mediaFileIdIdx: index('media_file_versions_media_file_id_idx').on(
      table.mediaFileId,
    ),
    versionIdx: index('media_file_versions_version_idx').on(
      table.mediaFileId,
      table.versionNumber,
    ),
  }),
);
