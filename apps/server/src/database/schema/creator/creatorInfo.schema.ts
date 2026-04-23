import { pgTable, text } from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { users } from '../users/users.schema';

export const creatorInfo = pgTable('creator_info', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  phone: text('phone'),
  cvr: text('cvr'),
  address: text('address'),
  city: text('city'),
  postalCode: text('postal_code'),
  exampleWorkLink: text('example_work_link'),
  contentDescription: text('content_description'),

  ...baseTimestamps,
});
