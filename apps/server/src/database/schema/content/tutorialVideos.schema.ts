import { integer, pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { tutorialVideoSections } from './tutorialVideoSections.schema';

export const tutorialVideos = pgTable('tutorial_videos', {
  id: text('id').primaryKey(),
  sectionId: text('section_id')
    .notNull()
    .references(() => tutorialVideoSections.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 300 }).notNull(),
  description: text('description'),
  descriptionSecondary: text('description_secondary'),
  publisher: varchar('publisher', { length: 200 }),
  publishedYear: varchar('published_year', { length: 10 }),
  duration: varchar('duration', { length: 50 }),
  tags: text('tags'),
  videoUrl: text('video_url').notNull(),
  trailerUrl: text('trailer_url'),
  sortOrder: integer('sort_order').notNull().default(0),
  ...baseTimestamps,
});
