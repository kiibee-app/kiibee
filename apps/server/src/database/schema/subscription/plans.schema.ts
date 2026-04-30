import { boolean, integer, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';

export const plans = pgTable('plans', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  price: integer('price').notNull(),
  currency: varchar('currency', { length: 10 }).default('KR'),
  billingCycle: varchar('billing_cycle', { length: 10 }).notNull(),
  maxFiles: integer('max_files').notNull(),
  isActive: boolean('is_active').default(true),
  ...baseTimestamps,
});
