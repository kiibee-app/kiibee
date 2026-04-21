import { jsonb, pgTable, text } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { baseTimestamps } from 'src/utils/dbHelper';

export const userContentCategory = pgTable('user_content_categories', {
  id: text('id').primaryKey(),

  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  categoryIds: jsonb('category_ids').$type<string[]>().notNull(),

  ...baseTimestamps,
});
