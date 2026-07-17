import { pgTable, text, varchar, numeric } from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { users } from '../users/users.schema';
import { payoutStatusEnum } from '../enums';
import { creatorPayouts } from './creatorPayouts.schema';

export const creatorPayoutRequests = pgTable('creator_payout_requests', {
  id: text('id').primaryKey(),
  creatorId: text('creator_id')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  payoutId: text('payout_id')
    .notNull()
    .references(() => creatorPayouts.id, { onDelete: 'restrict' }),
  paymentMethodId: text('payment_method_id').notNull(),
  rawAmount: numeric('raw_amount', { precision: 10, scale: 2 })
    .default('0')
    .notNull(),
  processingFee: numeric('processing_fee', {
    precision: 10,
    scale: 2,
  }).notNull(),
  platformFee: numeric('platform_fee', { precision: 10, scale: 2 }).notNull(),
  payableAmount: numeric('payable_amount', {
    precision: 10,
    scale: 2,
  }).notNull(),
  currency: varchar('currency', { length: 10 }).notNull().default('DKK'),
  status: payoutStatusEnum('status').notNull().default('pending'),

  ...baseTimestamps,
});
