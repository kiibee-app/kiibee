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
import { contentTypes } from './contentTypes.schema';

export const mediaFiles = pgTable(
  'media_files',
  {
    id: text('id').primaryKey(),
    creatorId: text('creator_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    title: varchar('title', { length: 500 }).notNull(),
    slug: varchar('slug', { length: 500 }).notNull(),
    description: text('description'),

    fileKey: text('file_key'),
    contentUrl: text('content_url'),
    contentTypeId: text('content_type_id').references(() => contentTypes.id, {
      onDelete: 'set null',
    }),
    fileSize: integer('file_size'),
    publishedYear: integer('published_year'),
    duration: integer('duration'),
    thumbnailUrl: text('thumbnail_url'),
    thumbnailLandscapeUrl: text('thumbnail_landscape_url'),
    trailerUrl: text('trailer_url'),
    production_company: varchar('production_company', { length: 255 }),
    manufacturerLink: text('manufacturer_link'),

    visibility: visibilityEnum('visibility').notNull().default('draft'),
    accessType: accessTypeEnum('access_type').notNull().default('free'),

    buyPrice: numeric('buy_price', { precision: 10, scale: 2 }),
    rentPrice: numeric('rent_price', { precision: 10, scale: 2 }),
    rentDurationHours: integer('rent_duration_hours'),
    currency: varchar('currency', { length: 10 }).default('DKK'),
    physicalProductLink: text('physical_product_link'),

    passwordHash: text('password_hash'),
    isDownloadable: boolean('is_downloadable').notNull().default(false),
    maxDownloadCount: integer('max_download_count').default(5),
    sortOrder: integer('sort_order').notNull().default(0),
    isPublished: boolean('is_published').notNull().default(false),
    publishedAt: timestamp('published_at', { withTimezone: true }),

    ...softDeleteFields,
    ...baseTimestamps,
  },
  (table) => ({
    slugUnique: uniqueIndex('media_files_slug_unique').on(table.slug),
    creatorIdIdx: index('media_files_creator_id_idx').on(table.creatorId),
    contentTypeIdIdx: index('media_files_content_type_id_idx').on(
      table.contentTypeId,
    ),
    visibilityIdx: index('media_files_visibility_idx').on(table.visibility),
    accessTypeIdx: index('media_files_access_type_idx').on(table.accessType),
    isPublishedIdx: index('media_files_is_published_idx').on(table.isPublished),
    isDeletedIdx: index('media_files_is_deleted_idx').on(table.isDeleted),
    creatorPublishedIdx: index('media_files_creator_published_idx').on(
      table.creatorId,
      table.isPublished,
    ),
  }),
);
