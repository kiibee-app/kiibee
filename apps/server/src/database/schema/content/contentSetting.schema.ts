import { pgTable, text, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { users } from '../users/users.schema';
import { contentSettingsEnum } from '../enums';

export const contentSettings = pgTable(
  'content_settings',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    accessType: contentSettingsEnum('access_type').notNull().default('free'),
    passwordHash: text('password_hash'),
    ...baseTimestamps,
  },
  (table) => ({
    userIdIdx: index('content_settings_user_id_idx').on(table.userId),
    uniqueUserId: uniqueIndex('content_settings_unique_user_id').on(
      table.userId,
    ),
  }),
);
