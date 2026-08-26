import { pgTable, text, varchar, unique } from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { users } from '../users/users.schema';

/** Admin-managed payout details (separate from creator web payout settings). */
export const accountDetails = pgTable(
  'account_details',
  {
    id: text('id').primaryKey(),
    creatorId: text('creator_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    methodType: varchar('method_type', { length: 20 })
      .notNull()
      .default('bank'),

    accountNumber: varchar('account_number', { length: 50 }),
    accountHolderName: varchar('account_holder_name', { length: 255 }),
    bankName: varchar('bank_name', { length: 255 }),

    cardNumber: varchar('card_number', { length: 50 }),
    cardExpiry: varchar('card_expiry', { length: 10 }),

    ...baseTimestamps,
  },
  (table) => ({
    creatorIdUnique: unique('account_details_creator_id_unique').on(
      table.creatorId,
    ),
  }),
);
