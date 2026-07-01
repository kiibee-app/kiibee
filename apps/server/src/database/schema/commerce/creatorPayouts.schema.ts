import {
  pgTable,
  text,
  varchar,
  numeric,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { users } from '../users/users.schema';
import { payoutStatusEnum } from '../enums';

export const creatorPayouts = pgTable(
  'creator_payouts',
  {
    id: text('id').primaryKey(),
    creatorId: text('creator_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),

    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    currency: varchar('currency', { length: 10 }).notNull().default('DKK'),
    status: payoutStatusEnum('status').notNull().default('pending'),

    creditNo: varchar('credit_no', { length: 50 }),
    bankAccountInfo: text('bank_account_info'),
    cardNo: varchar('cardNo', { length: 50 }),
    payoutDate: timestamp('payout_date', { withTimezone: true }),

    ...baseTimestamps,
  },
  (table) => ({
    creatorIdIdx: index('creator_payouts_creator_id_idx').on(table.creatorId),
    statusIdx: index('creator_payouts_status_idx').on(table.status),
    payoutDateIdx: index('creator_payouts_payout_date_idx').on(
      table.payoutDate,
    ),
  }),
);
