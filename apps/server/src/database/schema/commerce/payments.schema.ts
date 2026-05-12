import {
  pgTable,
  text,
  varchar,
  numeric,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { orders } from './orders.schema';
import { paymentProviderEnum, paymentStatusEnum } from '../enums';

export const payments = pgTable(
  'payments',
  {
    id: text('id').primaryKey(),
    orderId: text('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'restrict' }),

    provider: paymentProviderEnum('provider').notNull(),
    providerReference: text('provider_reference'),

    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    currency: varchar('currency', { length: 10 }).notNull().default('DKK'),
    status: paymentStatusEnum('status').notNull().default('pending'),

    paidAt: timestamp('paid_at', { withTimezone: true }),
    refundedAt: timestamp('refunded_at', { withTimezone: true }),

    ...baseTimestamps,
  },
  (table) => ({
    orderIdIdx: index('payments_order_id_idx').on(table.orderId),
    providerIdx: index('payments_provider_idx').on(table.provider),
    statusIdx: index('payments_status_idx').on(table.status),
    paidAtIdx: index('payments_paid_at_idx').on(table.paidAt),
  }),
);
