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

export const creatorChannels = pgTable(
  'creator_channels',
  {
    id: text('id').primaryKey(),
    creatorId: text('creator_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    description: text('description'),
    bio: text('bio'),

    coverImageUrl: text('cover_image_url'),
    logoUrl: text('logo_url'),
    themeColor: varchar('theme_color', { length: 20 }),
    customDomain: varchar('custom_domain', { length: 255 }),

    isPublished: boolean('is_published').notNull().default(false),
    ...baseTimestamps,
  },
  (table) => ({
    creatorIdUnique: uniqueIndex('creator_channels_creator_id_unique').on(
      table.creatorId,
    ),
    slugUnique: uniqueIndex('creator_channels_slug_unique').on(table.slug),
    isPublishedIdx: index('creator_channels_is_published_idx').on(
      table.isPublished,
    ),
  }),
);
