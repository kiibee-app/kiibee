import { pgTable, text } from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { users } from '../users/users.schema';

export const featureCreators = pgTable('featured_creators', {
  id: text('id').primaryKey(),
  creatorId: text('creator_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  ...baseTimestamps,
});
