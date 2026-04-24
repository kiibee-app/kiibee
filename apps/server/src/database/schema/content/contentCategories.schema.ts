import { pgTable, text, varchar, boolean, index } from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';

export const contentCategories = pgTable(
  'content_categories',
  {
    id: text('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    isActive: boolean('is_active').notNull().default(true),
    ...baseTimestamps,
  },
  (table) => [index('content_categories_name_idx').on(table.name)],
);
