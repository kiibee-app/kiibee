import 'dotenv/config';
import { seedContentCategories } from './contentCategories.seed';
import { seedContentTypes } from './contentTypes.seed';

async function main() {
  await seedContentCategories();
  await seedContentTypes();
  console.log('All seeds completed successfully');
  process.exit();
}

main().catch(console.error);
