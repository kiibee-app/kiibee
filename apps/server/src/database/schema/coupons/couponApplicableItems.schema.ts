import { pgTable, text, index } from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { coupons } from './coupons.schema';
import { mediaFiles } from '../content/mediaFiles.schema';
import { collections } from '../content/collections.schema';

export const couponApplicableItems = pgTable(
  'coupon_applicable_items',
  {
    id: text('id').primaryKey(),
    couponId: text('coupon_id')
      .notNull()
      .references(() => coupons.id, { onDelete: 'cascade' }),

    mediaFileId: text('media_file_id').references(() => mediaFiles.id, {
      onDelete: 'cascade',
    }),
    collectionId: text('collection_id').references(() => collections.id, {
      onDelete: 'cascade',
    }),

    ...baseTimestamps,
  },
  (table) => ({
    couponIdIdx: index('coupon_applicable_items_coupon_id_idx').on(
      table.couponId,
    ),
    mediaFileIdIdx: index('coupon_applicable_items_media_file_id_idx').on(
      table.mediaFileId,
    ),
    collectionIdIdx: index('coupon_applicable_items_collection_id_idx').on(
      table.collectionId,
    ),
  }),
);
