import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const logs = pgTable('logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  action: varchar('action', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
