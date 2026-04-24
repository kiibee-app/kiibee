import { contentCategories } from '../schema/content/contentCategories.schema';
import { db } from '../db';

export const seedContentCategories = async () => {
  const categories = [
    {
      id: 'comedy',
      name: 'Comedy',
      description: 'Funny and entertaining content',
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

  console.log('Content categories seeded successfully');
};
