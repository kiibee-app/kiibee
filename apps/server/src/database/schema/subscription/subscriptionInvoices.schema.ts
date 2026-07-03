import {
  pgTable,
  text,
  varchar,
  numeric,
  timestamp,
  index,
  jsonb,
  uniqueIndex,
  uuid,
  boolean,
} from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { users } from '../users/users.schema';
import { invoiceStatusEnum } from '../enums';
import { plans } from './plans.schema';

export const subscriptions = pgTable(
  'subscriptions',
  {
    id: text('id').primaryKey(),
    planId: uuid('plan_id')
      .notNull()
      .references(() => plans.id, { onDelete: 'restrict' }),
    creatorId: text('creator_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    currency: varchar('currency', { length: 10 }).notNull().default('DKK'),
    status: invoiceStatusEnum('status').notNull().default('pending'),
    invoiceNumber: varchar('invoice_number', { length: 50 }).notNull(),
    billingPeriod: varchar('billing_period', { length: 20 }),
    startAt: timestamp('start_at').notNull(),
    endAt: timestamp('end_at').notNull(),
    nextPaymentAttemptAt: timestamp('next_payment_attempt_at'),
    paymentProvider: varchar('payment_provider', { length: 20 })
      .notNull()
      .default('epay'),
    paymentReference: text('payment_reference'),
    agreementId: text('agreement_id'),
    rawPayload: jsonb('raw_payload'),
    processedAt: timestamp('processed_at'),
    isActive: boolean('is_active').notNull().default(true),
    ...baseTimestamps,
  },
  (table) => ({
    planIdIdx: index('subscription_invoices_plan_id_idx').on(table.planId),
    creatorIdIdx: index('subscription_invoices_creator_id_idx').on(
      table.creatorId,
    ),
    statusIdx: index('subscription_invoices_status_idx').on(table.status),
    invoiceNumberIdx: index('subscription_invoices_invoice_number_idx').on(
      table.invoiceNumber,
    ),
    agreementIdIdx: index('subscription_invoices_agreement_id_idx').on(
      table.agreementId,
    ),
    paymentReferenceIdx: index(
      'subscription_invoices_payment_reference_idx',
    ).on(table.paymentReference),
    uniqueInvoice: uniqueIndex('subscription_invoice_unique').on(
      table.creatorId,
      table.planId,
      table.billingPeriod,
    ),
  }),
);
