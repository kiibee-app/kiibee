import { integer, pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';

export const tutorialQuickguides = pgTable('tutorial_quickguides', {
  id: text('id').primaryKey(),
  title: varchar('title', { length: 300 }).notNull(),
  pdfUrl: text('pdf_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  sortOrder: integer('sort_order').notNull().default(0),
  ...baseTimestamps,
});
