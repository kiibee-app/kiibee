import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  index,
} from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';

export const contentCategories = pgTable(
  'content_categories',
  {
    id: text('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    isActive: boolean('is_active').notNull().default(true),

    // Umbraco migration mapping (cmsTags.id / group)
    legacyUmbracoId: integer('legacy_umbraco_id'),

    ...baseTimestamps,
  },
  (table) => [index('content_categories_name_idx').on(table.name)],
);
