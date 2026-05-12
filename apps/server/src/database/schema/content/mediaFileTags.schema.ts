import { pgTable, text, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { mediaFiles } from './mediaFiles.schema';
import { tags } from './tags.schema';

export const mediaFileTags = pgTable(
  'media_file_tags',
  {
    id: text('id').primaryKey(),
    mediaFileId: text('media_file_id')
      .notNull()
      .references(() => mediaFiles.id, { onDelete: 'cascade' }),
    tagId: text('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
    ...baseTimestamps,
  },
  (table) => ({
    mediaTagUnique: uniqueIndex('media_file_tags_unique').on(
      table.mediaFileId,
      table.tagId,
    ),
    mediaFileIdIdx: index('media_file_tags_media_file_id_idx').on(
      table.mediaFileId,
    ),
    tagIdIdx: index('media_file_tags_tag_id_idx').on(table.tagId),
  }),
);
