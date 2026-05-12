import {
  pgTable,
  text,
  varchar,
  numeric,
  integer,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { baseTimestamps, softDeleteFields } from 'src/utils/dbHelper';
import { users } from '../users/users.schema';
import { couponStatusEnum, couponDiscountTypeEnum } from '../enums';

export const coupons = pgTable(
  'coupons',
  {
    id: text('id').primaryKey(),
    creatorId: text('creator_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    title: varchar('title', { length: 255 }).notNull(),
    discountType: couponDiscountTypeEnum('discount_type').notNull(),
    discountValue: numeric('discount_value', {
      precision: 10,
      scale: 2,
    }).notNull(),
    currency: varchar('currency', { length: 10 }).default('DKK'),

    status: couponStatusEnum('status').notNull().default('active'),
    validFrom: timestamp('valid_from', { withTimezone: true }),
    validUntil: timestamp('valid_until', { withTimezone: true }),
    maxUses: integer('max_uses'),
    currentUses: integer('current_uses').notNull().default(0),

    ...softDeleteFields,
    ...baseTimestamps,
  },
  (table) => ({
    creatorIdIdx: index('coupons_creator_id_idx').on(table.creatorId),
    statusIdx: index('coupons_status_idx').on(table.status),
    validUntilIdx: index('coupons_valid_until_idx').on(table.validUntil),
    isDeletedIdx: index('coupons_is_deleted_idx').on(table.isDeleted),
  }),
);
