import {
  pgTable,
  text,
  varchar,
  numeric,
  timestamp,
  date,
  index,
} from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { users } from '../users/users.schema';
import { creatorPlans } from './creatorPlan.schema';
import { invoiceStatusEnum } from '../enums';

export const subscriptionInvoices = pgTable(
  'subscription_invoices',
  {
    id: text('id').primaryKey(),
    creatorPlanId: text('creator_plan_id')
      .notNull()
      .references(() => creatorPlans.id, { onDelete: 'restrict' }),
    creatorId: text('creator_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),

    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    currency: varchar('currency', { length: 10 }).notNull().default('DKK'),
    status: invoiceStatusEnum('status').notNull().default('pending'),

    invoiceNumber: varchar('invoice_number', { length: 50 }).notNull(),
    billingPeriodStart: date('billing_period_start').notNull(),
    billingPeriodEnd: date('billing_period_end').notNull(),
    paidAt: timestamp('paid_at', { withTimezone: true }),

    ...baseTimestamps,
  },
  (table) => ({
    creatorPlanIdIdx: index('subscription_invoices_creator_plan_id_idx').on(
      table.creatorPlanId,
    ),
    creatorIdIdx: index('subscription_invoices_creator_id_idx').on(
      table.creatorId,
    ),
    statusIdx: index('subscription_invoices_status_idx').on(table.status),
    invoiceNumberIdx: index('subscription_invoices_invoice_number_idx').on(
      table.invoiceNumber,
    ),
  }),
);
