import { pgTable, text, varchar, index } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { baseTimestamps, softDeleteFields } from 'src/utils/dbHelper';

export const creatorApplicationRequests = pgTable(
  'creator_application_requests',
  {
    id: text('id').primaryKey(),
    fullName: varchar('full_name', { length: 200 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 30 }),
    cvr: varchar('cvr', { length: 20 }),
    address: text('address'),
    city: varchar('city', { length: 100 }),
    postalCode: varchar('postal_code', { length: 20 }),
    exampleWorkLink: text('example_work_link'),
    contentDescription: text('content_description'),
    status: varchar('status', { length: 30 }).notNull().default('pending'),
    approvedUserId: text('approved_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),

    ...softDeleteFields,
    ...baseTimestamps,
  },
  (table) => ({
    emailIdx: index('creator_application_requests_email_idx').on(table.email),
    statusIdx: index('creator_application_requests_status_idx').on(
      table.status,
    ),
    approvedUserIdIdx: index(
      'creator_application_requests_approved_user_id_idx',
    ).on(table.approvedUserId),
    isDeletedIdx: index('creator_application_requests_is_deleted_idx').on(
      table.isDeleted,
    ),
  }),
);
