import { pgTable, text, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from '../users/users.schema';

// An admin assignment is a payment request, not a completed ePay transaction.
export const adminBillingRequests = pgTable(
  'admin_billing_requests',
  {
    id: text('id').primaryKey(),
    creatorId: text('creator_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    planId: text('plan_id').notNull(),
    planName: text('plan_name').notNull(),
    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    currency: text('currency').notNull(),
    status: text('status').notNull().default('pending'),
    transactionId: text('transaction_id'),
    emailStatus: text('email_status').notNull().default('pending'),
    emailSentAt: timestamp('email_sent_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    creatorIdx: index('admin_billing_requests_creator_idx').on(
      table.creatorId,
      table.planId,
    ),
    transactionIdx: index('admin_billing_requests_transaction_idx').on(
      table.transactionId,
    ),
  }),
);
