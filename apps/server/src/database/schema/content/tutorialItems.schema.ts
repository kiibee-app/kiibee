import { integer, pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';

export const TUTORIAL_ITEM_TYPES = ['section', 'video', 'quickguide'] as const;
export type TutorialItemType = (typeof TUTORIAL_ITEM_TYPES)[number];

export const tutorialItems = pgTable('tutorial_items', {
  id: text('id').primaryKey(),
  type: varchar('type', { length: 20 }).notNull().$type<TutorialItemType>(),
  parentId: text('parent_id'),
  title: varchar('title', { length: 300 }).notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  gridMaxWidth: varchar('grid_max_width', { length: 50 }),
  description: text('description'),
  descriptionSecondary: text('description_secondary'),
  publisher: varchar('publisher', { length: 200 }),
  publishedYear: varchar('published_year', { length: 10 }),
  duration: varchar('duration', { length: 50 }),
  tags: text('tags'),
  videoUrl: text('video_url'),
  trailerUrl: text('trailer_url'),
  pdfUrl: text('pdf_url'),
  thumbnailUrl: text('thumbnail_url'),
  ...baseTimestamps,
});
