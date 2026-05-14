import { pgTable, text, varchar, boolean, unique } from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { users } from '../users/users.schema';

export const creatorBankAccounts = pgTable(
  'creator_bank_accounts',
  {
    id: text('id').primaryKey(),
    creatorId: text('creator_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    bankName: varchar('bank_name', { length: 255 }).notNull(),
    accountNumber: varchar('account_number', { length: 50 }).notNull(),
    registrationNumber: varchar('registration_number', {
      length: 20,
    }).notNull(),

    isDefault: boolean('is_default').notNull().default(false),
    isVerified: boolean('is_verified').notNull().default(false),

    ...baseTimestamps,
  },
  (table) => ({
    creatorIdUnique: unique('creator_bank_accounts_creator_id_unique').on(
      table.creatorId,
    ),
  }),
);
