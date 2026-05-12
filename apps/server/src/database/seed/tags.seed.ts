import { db } from '../db';
import { tags } from '../schema/content/tags.schema';

export const seedTags = async () => {
  const systemTags = [
    { id: 'trending', name: 'Trending', slug: 'trending' },
    { id: 'new', name: 'New', slug: 'new' },
    { id: 'featured', name: 'Featured', slug: 'featured' },
    { id: 'bestseller', name: 'Bestseller', slug: 'bestseller' },
    { id: 'free', name: 'Free', slug: 'free' },
    { id: 'popular', name: 'Popular', slug: 'popular' },
    { id: 'recommended', name: 'Recommended', slug: 'recommended' },
    { id: 'editors-pick', name: "Editor's Pick", slug: 'editors-pick' },
  ];

  for (const tag of systemTags) {
    await db.insert(tags).values(tag).onConflictDoNothing();
  }

  console.log('Tags seeded successfully');
};
