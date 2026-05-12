import { pgTable, text, timestamp, index } from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { users } from '../users/users.schema';
import { mediaFiles } from '../content/mediaFiles.schema';
import { importProviderEnum, importStatusEnum } from '../enums';

export const externalImports = pgTable(
  'external_imports',
  {
    id: text('id').primaryKey(),
    creatorId: text('creator_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    mediaFileId: text('media_file_id').references(() => mediaFiles.id, {
      onDelete: 'set null',
    }),

    provider: importProviderEnum('provider').notNull(),
    externalUrl: text('external_url').notNull(),
    externalId: text('external_id'),

    importStatus: importStatusEnum('import_status')
      .notNull()
      .default('pending'),
    importedAt: timestamp('imported_at', { withTimezone: true }),

    ...baseTimestamps,
  },
  (table) => ({
    creatorIdIdx: index('external_imports_creator_id_idx').on(table.creatorId),
    providerIdx: index('external_imports_provider_idx').on(table.provider),
    importStatusIdx: index('external_imports_import_status_idx').on(
      table.importStatus,
    ),
  }),
);
