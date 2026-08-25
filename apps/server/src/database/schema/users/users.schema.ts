import { sql } from 'drizzle-orm';
import {
  pgTable,
  text,
  varchar,
  boolean,
  index,
  uniqueIndex,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { baseTimestamps, softDeleteFields } from 'src/utils/dbHelper';

export const userStatusEnum = pgEnum('user_status', [
  'pending-setup',
  'active',
  'inactive',
  'suspended',
  'deleted',
]);

export const users = pgTable(
  'users',
  {
    id: text('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull(),
    passwordHash: text('password_hash'),
    firstName: varchar('first_name', { length: 100 }),
    lastName: varchar('last_name', { length: 100 }),
    fullName: varchar('full_name', { length: 200 }),
    role: varchar('role', { length: 30 }).notNull().default('viewer'),
    status: userStatusEnum('status').notNull().default('pending-setup'),
    avatarUrl: text('avatar_url'),

    isEmailVerified: boolean('is_email_verified').notNull().default(false),
    isActive: boolean('is_active').notNull().default(true),
    isHidden: boolean('is_hidden').notNull().default(false),

    ...softDeleteFields,
    ...baseTimestamps,
  },
  (table) => ({
    emailUnique: uniqueIndex('users_email_unique')
      .on(table.email)
      .where(sql`${table.isDeleted} = false`),
    roleIdx: index('users_role_idx').on(table.role),
    statusIdx: index('users_status_idx').on(table.status),
    isDeletedIdx: index('users_is_deleted_idx').on(table.isDeleted),
    isHiddenIdx: index('users_is_hidden_idx').on(table.isHidden),
  }),
);
