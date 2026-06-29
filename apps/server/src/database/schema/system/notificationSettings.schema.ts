import {
  index,
  text,
  timestamp,
  uniqueIndex,
  varchar,
  pgTable,
} from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { users } from '../users/users.schema';
import {
  notificationFrequencyEnum,
  notificationRecipientEnum,
  notificationSettingTypeEnum,
} from '../enums';

export const notificationSettings = pgTable(
  'notification_settings',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: notificationSettingTypeEnum('type').notNull().default('overview'),
    frequency: notificationFrequencyEnum('frequency')
      .notNull()
      .default('monthly'),
    recipient: notificationRecipientEnum('recipient')
      .notNull()
      .default('account_email'),
    otherEmail: varchar('other_email', { length: 255 }),
    lastSentAt: timestamp('last_sent_at', { withTimezone: true }),
    ...baseTimestamps,
  },
  (table) => ({
    userIdUnique: uniqueIndex('notification_settings_user_id_unique').on(
      table.userId,
    ),
    userIdIdx: index('notification_settings_user_id_idx').on(table.userId),
  }),
);
