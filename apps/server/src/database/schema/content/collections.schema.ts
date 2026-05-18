import {
  pgTable,
  text,
  varchar,
  boolean,
  integer,
  timestamp,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

import { baseTimestamps, softDeleteFields } from 'src/utils/dbHelper';
import { users } from '../users/users.schema';
import { visibilityEnum, accessTypeEnum } from '../enums';

export const collections = pgTable(
  'collections',
  {
    id: text('id').primaryKey(),

    creatorId: text('creator_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    name: varchar('name', { length: 500 }).notNull(),
    slug: varchar('slug', { length: 500 }).notNull(),
    coverImageUrl: text('cover_image_url'),
    description: text('description'),
    visibility: visibilityEnum('visibility').notNull().default('draft'),
    accessType: accessTypeEnum('access_type').notNull().default('free'),
    sortOrder: integer('sort_order').notNull().default(0),
    isPublished: boolean('is_published').notNull().default(false),
    publishedAt: timestamp('published_at', {
      withTimezone: true,
    }),

    ...softDeleteFields,
    ...baseTimestamps,
  },
  (table) => ({
    slugUnique: uniqueIndex('collections_slug_unique').on(table.slug),

    creatorIdIdx: index('collections_creator_id_idx').on(table.creatorId),

    visibilityIdx: index('collections_visibility_idx').on(table.visibility),

    accessTypeIdx: index('collections_access_type_idx').on(table.accessType),

    isPublishedIdx: index('collections_is_published_idx').on(table.isPublished),

    isDeletedIdx: index('collections_is_deleted_idx').on(table.isDeleted),
  }),
);
