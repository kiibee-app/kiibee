/**
 * Standalone script: re-runs only seedUmbracoShows() to update
 * maxDownloadCount and pick up newly exported collections — without
 * wiping / re-seeding the entire database.
 *
 * Run from apps/server/:
 *   pnpm seed:shows-only
 * or:
 *   tsx src/database/seed/seedShowsOnly.ts
 */
import 'dotenv/config';
import { seedUmbracoShows } from './umbracoShows.seed';

async function main() {
  console.log('Running seedUmbracoShows (upsert-only, no data reset)...');
  await seedUmbracoShows();
  console.log('Done.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
