import { jsonb, pgTable, text } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { baseTimestamps } from 'src/utils/dbHelper';

export const userContentTypes = pgTable('user_content_types', {
  id: text('id').primaryKey(),

  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  typesIds: jsonb('types_ids').$type<string[]>().notNull(),

  ...baseTimestamps,
});
