import {
  pgTable,
  text,
  varchar,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { baseTimestamps, softDeleteFields } from 'src/utils/dbHelper';

export const userProfiles = pgTable(
  'user_profiles',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    phone: varchar('phone', { length: 30 }),
    cvr: varchar('cvr', { length: 20 }),
    address: text('address'),
    city: varchar('city', { length: 100 }),
    postalCode: varchar('postal_code', { length: 20 }),
    ...softDeleteFields,
    ...baseTimestamps,
  },
  (table) => ({
    userIdUnique: uniqueIndex('user_profiles_user_id_unique').on(table.userId),
    userIdIdx: index('user_profiles_user_id_idx').on(table.userId),
    isDeletedIdx: index('user_profiles_is_deleted_idx').on(table.isDeleted),
  }),
);
