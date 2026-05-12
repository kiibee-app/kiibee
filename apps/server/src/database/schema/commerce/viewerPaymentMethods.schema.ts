import {
  pgTable,
  text,
  varchar,
  boolean,
  integer,
  index,
} from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { users } from '../users/users.schema';

export const viewerPaymentMethods = pgTable(
  'viewer_payment_methods',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    brand: varchar('brand', { length: 30 }).notNull(),
    lastFour: varchar('last_four', { length: 4 }).notNull(),
    cardTokenHash: text('card_token_hash').notNull(),
    expiryMonth: integer('expiry_month').notNull(),
    expiryYear: integer('expiry_year').notNull(),

    isDefault: boolean('is_default').notNull().default(false),
    isActive: boolean('is_active').notNull().default(true),

    ...baseTimestamps,
  },
  (table) => ({
    userIdIdx: index('viewer_payment_methods_user_id_idx').on(table.userId),
    isActiveIdx: index('viewer_payment_methods_is_active_idx').on(
      table.isActive,
    ),
  }),
);
