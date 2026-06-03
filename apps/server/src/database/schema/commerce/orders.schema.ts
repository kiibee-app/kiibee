import { pgTable, text, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { mediaFiles } from '../content/mediaFiles.schema';
import { collections } from '../content/collections.schema';
import { orderItemTypeEnum } from '../enums';
import { users } from '../users/users.schema';

export const orders = pgTable(
  'orders',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    mediaFileId: text('media_file_id').references(() => mediaFiles.id, {
      onDelete: 'set null',
    }),
    collectionId: text('collection_id').references(() => collections.id, {
      onDelete: 'set null',
    }),

    itemType: orderItemTypeEnum('item_type').notNull(),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
    currency: text('currency').notNull().default('DKK'),
    rentExpiresAt: timestamp('rent_expires_at', { withTimezone: true }),

    ...baseTimestamps,
  },
  (table) => ({
    mediaFileIdIdx: index('order_items_media_file_id_idx').on(
      table.mediaFileId,
    ),
    collectionIdIdx: index('order_items_collection_id_idx').on(
      table.collectionId,
    ),
    itemTypeIdx: index('order_items_item_type_idx').on(table.itemType),
  }),
);
