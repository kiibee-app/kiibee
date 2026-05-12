import {
  pgTable,
  text,
  varchar,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { coupons } from './coupons.schema';
import { users } from '../users/users.schema';

export const couponCodes = pgTable(
  'coupon_codes',
  {
    id: text('id').primaryKey(),
    couponId: text('coupon_id')
      .notNull()
      .references(() => coupons.id, { onDelete: 'cascade' }),

    code: varchar('code', { length: 50 }).notNull(),
    isUsed: boolean('is_used').notNull().default(false),
    usedBy: text('used_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    usedAt: timestamp('used_at', { withTimezone: true }),

    ...baseTimestamps,
  },
  (table) => ({
    codeUnique: uniqueIndex('coupon_codes_code_unique').on(table.code),
    couponIdIdx: index('coupon_codes_coupon_id_idx').on(table.couponId),
    isUsedIdx: index('coupon_codes_is_used_idx').on(table.isUsed),
  }),
);
