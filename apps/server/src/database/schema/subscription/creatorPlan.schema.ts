import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { users } from '../users/users.schema';
import { plans } from './plans.schema';

export const creatorPlans = pgTable('creator_plans', {
  id: text('id').primaryKey(),
  planId: uuid('plan_id')
    .notNull()
    .references(() => plans.id, { onDelete: 'cascade' }),
  creatorId: text('creator_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('active'),
  ...baseTimestamps,
});
