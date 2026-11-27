import {
  pgTable,
  text,
  boolean,
  integer,
  bigint,
  timestamp,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const adminMfa = pgTable('admin_mfa', {
  userId: text('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  encryptedSecret: text('encrypted_secret').notNull(),
  enabled: boolean('enabled').notNull().default(false),
  setupExpiresAt: timestamp('setup_expires_at', {
    withTimezone: true,
  }).notNull(),
  lastUsedStep: bigint('last_used_step', { mode: 'number' }),
  recoveryCodeHashes: text('recovery_code_hashes')
    .array()
    .notNull()
    .default([]),
  failedAttempts: integer('failed_attempts').notNull().default(0),
  lockedUntil: timestamp('locked_until', { withTimezone: true }),
});
