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
