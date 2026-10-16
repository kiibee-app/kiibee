import {
  pgTable,
  text,
  varchar,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { users } from '../users/users.schema';

export const creatorOwners = pgTable(
  'creator_owners',
  {
    id: text('id').primaryKey(),
    creatorId: text('creator_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    firstName: varchar('first_name', { length: 255 }),
    lastName: varchar('last_name', { length: 255 }),
    email: varchar('email', { length: 255 }),
    phone: varchar('phone', { length: 50 }),
    ...baseTimestamps,
  },
  (table) => ({
    creatorIdUnique: uniqueIndex('creator_owners_creator_id_unique').on(
      table.creatorId,
    ),
    nameIdx: index('creator_owners_name_idx').on(table.name),
  }),
);
