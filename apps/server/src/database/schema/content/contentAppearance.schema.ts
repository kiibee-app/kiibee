import {
  pgTable,
  text,
  varchar,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

import { baseTimestamps } from 'src/utils/dbHelper';
import { users } from '../users/users.schema';
import { layoutEnum } from '../enums';

export const contentAppearance = pgTable(
  'content_appearance',
  {
    id: text('id').primaryKey(),

    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    textColor: varchar('text_color', { length: 20 }).default('default'),
    buttonColor: varchar('button_color', { length: 20 }).default('default'),
    logoType: varchar('logo_type', { length: 10 }).default('text'),
    logoName: varchar('logo_name', { length: 100 }).default(''),
    logoUrl: text('logo_url'),
    description: varchar('description', { length: 500 }).default(''),
    layout: layoutEnum('layout').notNull().default('layout1'),
    desktopCoverImageUrl: text('desktop_cover_image_url'),
    mobileCoverImageUrl: text('mobile_cover_image_url'),
    receipt: varchar('receipt', { length: 200 }).default(''),
    supportEmail: varchar('support_email', { length: 255 }).default(''),

    ...baseTimestamps,
  },
  (table) => ({
    userIdx: index('content_appearance_user_idx').on(table.userId),

    userUnique: uniqueIndex('content_appearance_user_unique').on(table.userId),
  }),
);
