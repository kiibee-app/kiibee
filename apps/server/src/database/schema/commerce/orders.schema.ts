import { pgTable, text, varchar, numeric, index } from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { users } from '../users/users.schema';
import { orderStatusEnum } from '../enums';

export const orders = pgTable(
  'orders',
  {
    id: text('id').primaryKey(),
    buyerId: text('buyer_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    creatorId: text('creator_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),

    orderNumber: varchar('order_number', { length: 50 }).notNull(),
    status: orderStatusEnum('status').notNull().default('pending'),

    totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
    discountAmount: numeric('discount_amount', {
      precision: 10,
      scale: 2,
    }).default('0'),
    currency: varchar('currency', { length: 10 }).notNull().default('DKK'),

    couponCodeId: text('coupon_code_id'),
    paymentMethodType: varchar('payment_method_type', { length: 30 }),

    ...baseTimestamps,
  },
  (table) => ({
    buyerIdIdx: index('orders_buyer_id_idx').on(table.buyerId),
    creatorIdIdx: index('orders_creator_id_idx').on(table.creatorId),
    statusIdx: index('orders_status_idx').on(table.status),
    orderNumberIdx: index('orders_order_number_idx').on(table.orderNumber),
    createdAtIdx: index('orders_created_at_idx').on(table.createdAt),
  }),
);
