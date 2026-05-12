import { pgTable, text, timestamp, index } from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { users } from '../users/users.schema';
import { mediaFiles } from '../content/mediaFiles.schema';
import { collections } from '../content/collections.schema';
import { orderItems } from '../commerce/orderItems.schema';
import { userAccessTypeEnum } from '../enums';

export const userContentAccess = pgTable(
  'user_content_access',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    mediaFileId: text('media_file_id').references(() => mediaFiles.id, {
      onDelete: 'cascade',
    }),
    collectionId: text('collection_id').references(() => collections.id, {
      onDelete: 'cascade',
    }),

    accessType: userAccessTypeEnum('access_type').notNull(),
    orderItemId: text('order_item_id').references(() => orderItems.id, {
      onDelete: 'set null',
    }),

    rentExpiresAt: timestamp('rent_expires_at', { withTimezone: true }),
    grantedAt: timestamp('granted_at', { withTimezone: true })
      .notNull()
      .defaultNow(),

    ...baseTimestamps,
  },
  (table) => ({
    userIdIdx: index('user_content_access_user_id_idx').on(table.userId),
    mediaFileIdIdx: index('user_content_access_media_file_id_idx').on(
      table.mediaFileId,
    ),
    collectionIdIdx: index('user_content_access_collection_id_idx').on(
      table.collectionId,
    ),
    accessTypeIdx: index('user_content_access_access_type_idx').on(
      table.accessType,
    ),
    rentExpiresAtIdx: index('user_content_access_rent_expires_at_idx').on(
      table.rentExpiresAt,
    ),
    userMediaIdx: index('user_content_access_user_media_idx').on(
      table.userId,
      table.mediaFileId,
    ),
    userCollectionIdx: index('user_content_access_user_collection_idx').on(
      table.userId,
      table.collectionId,
    ),
  }),
);
