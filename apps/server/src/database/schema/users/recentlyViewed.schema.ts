import {
  bigint,
  index,
  jsonb,
  pgTable,
  primaryKey,
  text,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { mediaFiles } from '../content/mediaFiles.schema';

export type RecentContentMetadata = {
  title: string;
  href: string;
  thumbnailUrl?: string;
  creatorName?: string;
};

export const recentlyViewed = pgTable(
  'recently_viewed',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    contentId: text('content_id')
      .notNull()
      .references(() => mediaFiles.id, { onDelete: 'cascade' }),
    viewedAt: bigint('viewed_at', { mode: 'number' }).notNull(),
    metadata: jsonb('metadata').$type<RecentContentMetadata>().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.contentId] }),
    index('recently_viewed_user_date_idx').on(table.userId, table.viewedAt),
  ],
);
