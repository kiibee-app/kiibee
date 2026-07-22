import 'dotenv/config';
import { seedContentCategories } from './contentCategories.seed';
import { seedContentTypes } from './contentTypes.seed';
import { seedCreatorAccounts } from './creatorAccounts.seed';
import { seedPlans } from './subscriptionPlan.seed';
import { seedTags } from './tags.seed';
import { seedUmbracoProfiles } from './umbracoProfiles.seed';
import { seedUmbracoShows } from './umbracoShows.seed';
import { seedTutorialItems } from './tutorialItems.seed';
import { seedUsers } from './users.seed';
import { reconcileCreatorPlansWithContent } from './reconcileCreatorPlans.seed';
import { reconcileMissingCreatorChannels } from './reconcileCreatorChannels.seed';
import { reconcileMissingContentAppearance } from './reconcileContentAppearance.seed';

async function main() {
  await seedContentCategories();
  await seedContentTypes();
  await seedTags();
  await seedPlans();
  await seedTutorialItems();

  await seedUsers();
  await seedCreatorAccounts();
  await seedUmbracoProfiles();
  await seedUmbracoShows();
  await reconcileCreatorPlansWithContent();
  await reconcileMissingCreatorChannels();
  await reconcileMissingContentAppearance();

  console.log('All seeds completed successfully');
  process.exit();
}

main().catch(console.error);
