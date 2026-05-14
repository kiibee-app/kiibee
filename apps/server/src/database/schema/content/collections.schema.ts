import {
  pgTable,
  text,
  varchar,
  boolean,
  integer,
  numeric,
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
    description: text('description'),
    coverImageUrl: text('cover_image_url'),

    visibility: visibilityEnum('visibility').notNull().default('draft'),
    accessType: accessTypeEnum('access_type').notNull().default('free'),

    buyPrice: numeric('buy_price', { precision: 10, scale: 2 }),
    rentPrice: numeric('rent_price', { precision: 10, scale: 2 }),
    rentDurationHours: integer('rent_duration_hours'),
    currency: varchar('currency', { length: 10 }).default('DKK'),

    sortOrder: integer('sort_order').notNull().default(0),
    isPublished: boolean('is_published').notNull().default(false),
    publishedAt: timestamp('published_at', { withTimezone: true }),

    ...softDeleteFields,
    ...baseTimestamps,
  },
  (table) => ({
    slugUnique: uniqueIndex('collections_slug_unique').on(table.slug),
    creatorIdIdx: index('collections_creator_id_idx').on(table.creatorId),
    visibilityIdx: index('collections_visibility_idx').on(table.visibility),
    isPublishedIdx: index('collections_is_published_idx').on(table.isPublished),
    isDeletedIdx: index('collections_is_deleted_idx').on(table.isDeleted),
  }),
);
