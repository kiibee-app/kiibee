import { pgTable, text, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { mediaFiles } from './mediaFiles.schema';
import { contentCategories } from './contentCategories.schema';

export const mediaFileCategories = pgTable(
  'media_file_categories',
  {
    id: text('id').primaryKey(),
    mediaFileId: text('media_file_id')
      .notNull()
      .references(() => mediaFiles.id, { onDelete: 'cascade' }),
    categoryId: text('category_id')
      .notNull()
      .references(() => contentCategories.id, { onDelete: 'cascade' }),
    ...baseTimestamps,
  },
  (table) => ({
    mediaCategoryUnique: uniqueIndex('media_file_categories_unique').on(
      table.mediaFileId,
      table.categoryId,
    ),
    mediaFileIdIdx: index('media_file_categories_media_file_id_idx').on(
      table.mediaFileId,
    ),
    categoryIdIdx: index('media_file_categories_category_id_idx').on(
      table.categoryId,
    ),
  }),
);
