import 'dotenv/config';
import { seedContentCategories } from './contentCategories.seed';
import { seedContentTypes } from './contentTypes.seed';
import { seedCreatorAccounts } from './creatorAccounts.seed';
import { seedPlans } from './subscriptionPlan.seed';
import { seedTags } from './tags.seed';
import { seedUmbracoProfiles } from './umbracoProfiles.seed';
import { seedUmbracoShows } from './umbracoShows.seed';
import { seedUsers } from './users.seed';

async function main() {
  // Reference data first
  await seedContentCategories();
  await seedContentTypes();
  await seedTags();
  await seedPlans();

  // Base users, then creator accounts that depend on plans
  await seedUsers();
  await seedCreatorAccounts();
  await seedUmbracoProfiles();
  await seedUmbracoShows();

  console.log('All seeds completed successfully');
  process.exit();
}

main().catch(console.error);
