import {
  pgTable,
  text,
  varchar,
  numeric,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core';

import { users } from '../users/users.schema';
import { subscriptions } from './subscriptionInvoices.schema';

export const subscriptionPaymentsHistory = pgTable(
  'subscription_payments_history',
  {
    id: text('id').primaryKey(),
    subscriptionId: text('subscription_id')
      .notNull()
      .references(() => subscriptions.id, {
        onDelete: 'cascade',
      }),
    creatorId: text('creator_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    transactionId: varchar('transaction_id', { length: 50 }).notNull(),
    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    currency: varchar('currency', { length: 10 }).notNull(),
    status: varchar('status', { length: 20 }).notNull(),
    paymentMethodType: varchar('payment_method_type', {
      length: 30,
    }),
    cardNo: varchar('card_no', {
      length: 30,
    }),
    cardExpiry: varchar('card_expiry', {
      length: 20,
    }),
    cardType: varchar('card_type', {
      length: 20,
    }),

    reference: text('reference'),
    rawPayload: jsonb('raw_payload'),
    processedAt: timestamp('processed_at'),
    createdAt: timestamp('created_at').defaultNow(),
  },
);
