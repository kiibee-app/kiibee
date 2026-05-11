import 'dotenv/config';
import { seedContentCategories } from './contentCategories.seed';
import { seedContentTypes } from './contentTypes.seed';
import { seedPlans } from './subscriptionPlan.seed';
import { seedUsers } from './users.seed';

async function main() {
  await seedContentCategories();
  await seedContentTypes();
  await seedPlans();
  await seedUsers();
  console.log('All seeds completed successfully');
  process.exit();
}

main().catch(console.error);
