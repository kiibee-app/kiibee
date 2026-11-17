import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { users } from '../users/users.schema';
export const subscriptionCheckouts = pgTable('subscription_checkouts', {
  id: text('id').primaryKey(),
  creatorId: text('creator_id')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  planId: text('plan_id').notNull(),
  billingMonths: integer('billing_months').notNull(),
  customRevision: integer('custom_revision'),
  amountMinor: integer('amount_minor').notNull(),
  currency: text('currency').notNull(),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
