import { ne, sql } from 'drizzle-orm';

import { db } from '../db';
import { users } from '../schema';

const ADMIN_EMAIL = 'admin@gmail.com';

const SEEDED_DATA_TABLES = [
  'analytics_events',
  'analytics_daily_summary',
  'user_content_access',
  'payments',
  'orders',
  'creator_payouts',
  'creator_bank_accounts',
  'media_file_tags',
  'tags',
  'collection_items',
  'media_file_versions',
  'media_file_categories',
  'content_access',
  'content_appearance',
  'content_settings',
  'media_files',
  'collections',
  'creator_plans',
  'creator_channels',
  'creator_info',
  'featured_creators',
  'creator_application_requests',
  'audit_logs',
  'user_sessions',
  'user_profiles',
  'account_setup_tokens',
  'users_token',
  'revoked_tokens',
  'viewer_payment_methods',
  'subscription_invoices',
  'notifications',
  'email_subscribers',
  'live_events',
  'external_imports',
  'coupon_applicable_items',
  'coupon_codes',
  'coupons',
  'user_content_categories',
  'user_content_types',
] as const;

export async function resetSeedData(): Promise<void> {
  if (process.env.SEED_RESET !== 'true') {
    console.log(
      'Seed reset skipped (incremental mode; set SEED_RESET=true to wipe umbraco seed data first)',
    );
    return;
  }

  await db.execute(
    sql.raw(
      `TRUNCATE TABLE ${SEEDED_DATA_TABLES.join(', ')} RESTART IDENTITY CASCADE`,
    ),
  );

  await db.delete(users).where(ne(users.email, ADMIN_EMAIL));

  console.log(
    `Seed data reset completed (kept admin user; reference plans/categories/types preserved)`,
  );
}
