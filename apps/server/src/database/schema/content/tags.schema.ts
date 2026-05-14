import {
  pgTable,
  text,
  varchar,
  boolean,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { users } from '../users/users.schema';

export const tags = pgTable(
  'tags',
  {
    id: text('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    creatorId: text('creator_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    isActive: boolean('is_active').notNull().default(true),
    ...baseTimestamps,
  },
  (table) => ({
    slugUnique: uniqueIndex('tags_slug_unique').on(table.slug),
    nameIdx: index('tags_name_idx').on(table.name),
    creatorIdIdx: index('tags_creator_id_idx').on(table.creatorId),
  }),
);
