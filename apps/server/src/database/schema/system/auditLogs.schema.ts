import {
  pgTable,
  text,
  varchar,
  jsonb,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { users } from '../users/users.schema';

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => users.id, {
      onDelete: 'set null',
    }),

    action: varchar('action', { length: 100 }).notNull(),
    entityType: varchar('entity_type', { length: 100 }).notNull(),
    entityId: text('entity_id'),
    ipAddress: varchar('ip_address', { length: 100 }),
    details: jsonb('details'),

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userIdIdx: index('audit_logs_user_id_idx').on(table.userId),
    actionIdx: index('audit_logs_action_idx').on(table.action),
    entityTypeIdx: index('audit_logs_entity_type_idx').on(table.entityType),
    entityIdIdx: index('audit_logs_entity_id_idx').on(table.entityId),
    createdAtIdx: index('audit_logs_created_at_idx').on(table.createdAt),
  }),
);
