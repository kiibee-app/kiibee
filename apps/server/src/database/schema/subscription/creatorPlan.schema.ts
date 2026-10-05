import { pgTable, text, uuid, integer } from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { users } from '../users/users.schema';
import { plans } from './plans.schema';

export const creatorPlans = pgTable('creator_plans', {
  id: text('id').primaryKey(),
  planId: uuid('plan_id')
    .notNull()
    .references(() => plans.id, { onDelete: 'cascade' }),
  creatorId: text('creator_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('active'),

  // Custom subscription override fields
  customPrice: integer('custom_price'),
  customPrice3: integer('custom_price_3'),
  customPrice6: integer('custom_price_6'),
  customPrice12: integer('custom_price_12'),
  customMaxFiles: integer('custom_max_files'),
  customKiibeeCutDkk: integer('custom_kiibee_cut_dkk'),
  customTransactionFeePct: integer('custom_transaction_fee_pct'),
  paymentPeriod: text('payment_period'),

  ...baseTimestamps,
});
