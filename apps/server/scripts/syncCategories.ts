import 'dotenv/config';
import { eq, ilike } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { db } from '../src/database/db';
import { contentCategories } from '../src/database/schema/content/contentCategories.schema';
import { creatorChannels } from '../src/database/schema/creator/creatorChannels.schema';
import { userContentCategory } from '../src/database/schema/users/userContentCategories.shema';

async function main() {
  console.log('Starting categories sync...');

  const categories = [
    {
      id: 'comedy',
      name: 'Comedy',
      description: 'Funny and entertaining content',
      isActive: true,
    },
    {
      id: 'history',
      name: 'History',
      description: 'History and historical content',
      isActive: true,
    },
    {
      id: 'entertainment',
      name: 'Entertainment',
      description: 'Entertainment, movies, and shows',
      isActive: true,
    },
    {
      id: 'coaching',
      name: 'Coaching',
      description: 'Personal coaching and development',
      isActive: true,
    },
    {
      id: 'music',
      name: 'Music',
      description: 'Songs, albums, and music content',
      isActive: true,
    },
    {
      id: 'podcasts',
      name: 'Podcasts',
      description: 'Audio shows and podcasts',
      isActive: true,
    },
    {
      id: 'arts',
      name: 'Arts & Illustration',
      description: 'Art, drawings, and creative illustrations',
      isActive: true,
    },
    {
      id: 'books',
      name: 'Books & Writing',
      description: 'Books, stories, and writing content',
      isActive: true,
    },
    {
      id: 'wellness',
      name: 'Wellness & Mindfulness',
      description: 'Mental health and wellness content',
      isActive: true,
    },
    {
      id: 'education',
      name: 'Education / Learning',
      description: 'Educational and learning materials',
      isActive: true,
    },
    {
      id: 'lifestyle',
      name: 'Lifestyle & Vlogs',
      description: 'Daily life and vlog content',
      isActive: true,
    },
    {
      id: 'food',
      name: 'Cooking / Food',
      description: 'Recipes and food-related content',
      isActive: true,
    },
    {
      id: 'fitness',
      name: 'Sports & Fitness',
      description: 'Fitness and sports content',
      isActive: true,
    },
  ];

  for (const category of categories) {
    await db.insert(contentCategories).values(category).onConflictDoNothing();
  }

  console.log('Master categories synced successfully!');

  // Sync specific creator categories
  console.log('Syncing specific creator categories...');
  const creatorTargets = [
    {
      nameQuery: '%Eventyr%teat%',
      categoryIds: ['entertainment'],
    },
    {
      nameQuery: '%TANIA ELLIS%',
      categoryIds: ['education'],
    },
    {
      nameQuery: '%Pædagogisk Psykologisk%',
      categoryIds: ['education'],
    },
  ];

  for (const target of creatorTargets) {
    const channel = await db.query.creatorChannels.findFirst({
      where: ilike(creatorChannels.name, target.nameQuery),
    });

    if (!channel) {
      console.warn(
        `⚠️ Creator channel not found for query: "${target.nameQuery}"`,
      );
      continue;
    }

    const userId = channel.creatorId;

    const existingUserCategory = await db.query.userContentCategory.findFirst({
      where: eq(userContentCategory.userId, userId),
    });

    if (existingUserCategory) {
      await db
        .update(userContentCategory)
        .set({
          categoryIds: target.categoryIds,
          updatedAt: new Date(),
        })
        .where(eq(userContentCategory.userId, userId));

      console.log(
        `✅ Updated category for "${channel.name}" -> [${target.categoryIds.join(', ')}]`,
      );
    } else {
      await db.insert(userContentCategory).values({
        id: randomUUID(),
        userId,
        categoryIds: target.categoryIds,
      });

      console.log(
        `✅ Inserted category for "${channel.name}" -> [${target.categoryIds.join(', ')}]`,
      );
    }
  }

  console.log('Categories & Creator assignments synced successfully!');
  process.exit(0);
}

main().catch((err) => {
  console.error('Error syncing categories:', err);
  process.exit(1);
});
