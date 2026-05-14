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
import { mediaFileTypeEnum, visibilityEnum, accessTypeEnum } from '../enums';

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

    fileUrl: text('file_url'),
    fileType: mediaFileTypeEnum('file_type').notNull(),
    fileSize: integer('file_size'),
    duration: integer('duration'),
    thumbnailUrl: text('thumbnail_url'),
    trailerUrl: text('trailer_url'),

    visibility: visibilityEnum('visibility').notNull().default('draft'),
    accessType: accessTypeEnum('access_type').notNull().default('free'),

    buyPrice: numeric('buy_price', { precision: 10, scale: 2 }),
    rentPrice: numeric('rent_price', { precision: 10, scale: 2 }),
    rentDurationHours: integer('rent_duration_hours'),
    currency: varchar('currency', { length: 10 }).default('DKK'),

    passwordHash: text('password_hash'),
    isDownloadable: boolean('is_downloadable').notNull().default(false),
    sortOrder: integer('sort_order').notNull().default(0),
    isPublished: boolean('is_published').notNull().default(false),
    publishedAt: timestamp('published_at', { withTimezone: true }),

    ...softDeleteFields,
    ...baseTimestamps,
  },
  (table) => ({
    slugUnique: uniqueIndex('media_files_slug_unique').on(table.slug),
    creatorIdIdx: index('media_files_creator_id_idx').on(table.creatorId),
    fileTypeIdx: index('media_files_file_type_idx').on(table.fileType),
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
