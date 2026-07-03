import { integer, pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';

export const tutorialVideoSections = pgTable('tutorial_video_sections', {
  id: text('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  gridMaxWidth: varchar('grid_max_width', { length: 50 }),
  ...baseTimestamps,
});
