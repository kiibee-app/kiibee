import 'dotenv/config';
import { seedContentCategories } from './contentCategories.seed';
import { seedContentTypes } from './contentTypes.seed';
import { resetSeedData } from './resetSeedData';
import { seedPlans } from './subscriptionPlan.seed';
import { seedTags } from './tags.seed';
import { seedUmbracoLogs } from './umbracoLogs.seed';
import { seedUmbracoPayouts } from './umbracoPayouts.seed';
import { seedUmbracoProfiles } from './umbracoProfiles.seed';
import { seedUmbracoPurchases } from './umbracoPurchases.seed';
import { seedUmbracoShows } from './umbracoShows.seed';
import { seedUmbracoStats } from './umbracoStats.seed';
import { seedUsers } from './users.seed';

async function main() {
  // Optional full wipe — skipped by default so re-runs merge new umbraco-data
  await resetSeedData();

  // Reference data required by Umbraco content/profile seeds
  await seedContentCategories();
  await seedContentTypes();
  await seedTags();
  await seedPlans();

  // Only admin account; creators/viewers come from umbraco-data
  await seedUsers();

  // Creator profiles & content from umbraco-data
  await seedUmbracoProfiles();
  await seedUmbracoShows();

  // Commerce, analytics, and activity logs from umbraco-data
  await seedUmbracoPurchases();
  await seedUmbracoLogs();
  await seedUmbracoPayouts();
  await seedUmbracoStats();

  console.log('All seeds completed successfully');
  process.exit();
}

main().catch(console.error);
