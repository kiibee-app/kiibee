import 'dotenv/config';
import { seedContentCategories } from './contentCategories.seed';
import { seedContentTypes } from './contentTypes.seed';
import { seedPlans } from './subscriptionPlan.seed';
import { seedTags } from './tags.seed';
import { seedUsers } from './users.seed';
import { seedCreatorAccounts } from './creatorAccounts.seed';

async function main() {
  // Reference data first
  await seedContentCategories();
  await seedContentTypes();
  await seedTags();
  await seedPlans();

  // Users last (depends on nothing)
  await seedUsers();

  await seedCreatorAccounts();

  console.log('All seeds completed successfully');
  process.exit();
}

main().catch(console.error);
