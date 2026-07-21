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
import { seedTutorialItems } from './tutorialItems.seed';
import { seedUsers } from './users.seed';
import { backfillMissingPasswordHashes } from './backfillPasswordHashes.seed';
import { reconcileCreatorPlansWithContent } from './reconcileCreatorPlans.seed';
import { reconcileMissingCreatorChannels } from './reconcileCreatorChannels.seed';
import { removeSkippedUmbracoProfiles } from './umbracoSeed.db';

async function main() {
  await resetSeedData();
  await removeSkippedUmbracoProfiles();

  await seedContentCategories();
  await seedContentTypes();
  await seedTags();
  await seedPlans();
  await seedTutorialItems();

  await seedUsers();

  await seedUmbracoProfiles();
  await seedUmbracoShows();
  await reconcileCreatorPlansWithContent();
  await reconcileMissingCreatorChannels();

  await seedUmbracoPurchases();
  await seedUmbracoLogs();
  await seedUmbracoPayouts();
  await seedUmbracoStats();

  await backfillMissingPasswordHashes();

  console.log('All seeds completed successfully');
  process.exit();
}

main().catch(console.error);
