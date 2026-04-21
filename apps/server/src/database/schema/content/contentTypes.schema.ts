import { pgTable, text, varchar, boolean, index } from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';

export const contentTypes = pgTable(
  'content_types',
  {
    id: text('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    isActive: boolean('is_active').notNull().default(true),
    ...baseTimestamps,
  },
  (table) => [index('content_types_name_idx').on(table.name)],
);
