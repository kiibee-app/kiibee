import {
  pgTable,
  text,
  timestamp,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';

export const revokedTokens = pgTable(
  'revoked_tokens',
  {
    id: text('id').primaryKey(),
    jti: text('jti').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    ...baseTimestamps,
  },
  (table) => ({
    jtiUnique: uniqueIndex('revoked_tokens_jti_unique').on(table.jti),
    jtiIdx: index('revoked_tokens_jti_idx').on(table.jti),
    expiresAtIdx: index('revoked_tokens_expires_at_idx').on(table.expiresAt),
  }),
);
