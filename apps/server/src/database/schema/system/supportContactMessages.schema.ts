import { pgTable, text, varchar, index } from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';

export const supportContactMessages = pgTable(
  'support_contact_messages',
  {
    id: text('id').primaryKey(),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    lastName: varchar('last_name', { length: 100 }),
    companyName: varchar('company_name', { length: 200 }),
    phoneNumber: varchar('phone_number', { length: 30 }),
    email: varchar('email', { length: 255 }).notNull(),
    message: text('message').notNull(),

    ...baseTimestamps,
  },
  (table) => ({
    emailIdx: index('support_contact_messages_email_idx').on(table.email),
    createdAtIdx: index('support_contact_messages_created_at_idx').on(
      table.createdAt,
    ),
  }),
);
