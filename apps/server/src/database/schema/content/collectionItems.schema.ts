import {
  pgTable,
  text,
  integer,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { collections } from './collections.schema';
import { mediaFiles } from './mediaFiles.schema';

export const collectionItems = pgTable(
  'collection_items',
  {
    id: text('id').primaryKey(),
    collectionId: text('collection_id')
      .notNull()
      .references(() => collections.id, { onDelete: 'cascade' }),
    mediaFileId: text('media_file_id')
      .notNull()
      .references(() => mediaFiles.id, { onDelete: 'cascade' }),
    sortOrder: integer('sort_order').notNull().default(0),
    ...baseTimestamps,
  },
  (table) => ({
    collectionMediaUnique: uniqueIndex('collection_items_unique').on(
      table.collectionId,
      table.mediaFileId,
    ),
    collectionIdIdx: index('collection_items_collection_id_idx').on(
      table.collectionId,
    ),
    mediaFileIdIdx: index('collection_items_media_file_id_idx').on(
      table.mediaFileId,
    ),
  }),
);
