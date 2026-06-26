import { pgTable, text, varchar, boolean } from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { users } from '../users/users.schema';

export const userCardInfo = pgTable('user_card_info', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  paymentMethodId: varchar('payment_method_id', { length: 255 }).notNull(),
  ePaySubscriptionId: varchar('epay_subscription_id', {
    length: 255,
  }).notNull(),
  cardNo: varchar('card_no', { length: 20 }).notNull(),
  expireDate: varchar('expire_date', { length: 20 }).notNull(),
  cardType: varchar('card_type', { length: 20 }).notNull(),
  isDefault: boolean('is_default').notNull().default(false),

  ...baseTimestamps,
});
