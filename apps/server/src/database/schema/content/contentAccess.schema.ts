import {
  pgTable,
  text,
  index,
  uniqueIndex,
  timestamp,
} from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { mediaFiles } from './mediaFiles.schema';
import { users } from '../users/users.schema';
import { orderItemTypeEnum } from '../enums';

export const contentAccess = pgTable(
  'content_access',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    mediaFileId: text('media_file_id')
      .notNull()
      .references(() => mediaFiles.id, { onDelete: 'cascade' }),
    accessTypeEnum: orderItemTypeEnum('access_type').notNull(),
    startedAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    ...baseTimestamps,
  },
  (table) => ({
    userMediaIdx: index('user_media_idx').on(table.userId, table.mediaFileId),
    uniqueUserMedia: uniqueIndex('unique_user_media').on(
      table.userId,
      table.mediaFileId,
    ),
  }),
);
