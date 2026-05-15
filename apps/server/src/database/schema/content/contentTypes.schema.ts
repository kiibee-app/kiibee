import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  index,
} from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';

export const contentTypes = pgTable(
  'content_types',
  {
    id: text('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    isActive: boolean('is_active').notNull().default(true),

    // Umbraco migration mapping (cmsContentType.nodeId)
    legacyUmbracoId: integer('legacy_umbraco_id'),

    ...baseTimestamps,
  },
  (table) => [index('content_types_name_idx').on(table.name)],
);
