import { db } from '../db';
import { tutorialQuickguides } from '../schema/content/tutorialQuickguides.schema';

const CDN_BASE = 'https://kiibee-bucket.lon1.cdn.digitaloceanspaces.com';

const guides = [
  {
    id: 'kiibee-brugervejledning',
    title: 'Kiibee brugervejledning',
    pdfUrl: `${CDN_BASE}/documents/kiibee-brugervejledning.pdf`,
    thumbnailUrl: `${CDN_BASE}/images/quickguides/kiibee-brugervejledning.png`,
    sortOrder: 0,
  },
  {
    id: 'download-guide',
    title: 'Download Guide',
    pdfUrl: `${CDN_BASE}/documents/Download%20guide.pdf`,
    thumbnailUrl: `${CDN_BASE}/images/quickguides/download-guide.png`,
    sortOrder: 1,
  },
] as const;

export const seedTutorialQuickguides = async () => {
  for (const guide of guides) {
    await db
      .insert(tutorialQuickguides)
      .values(guide)
      .onConflictDoUpdate({
        target: tutorialQuickguides.id,
        set: {
          title: guide.title,
          pdfUrl: guide.pdfUrl,
          thumbnailUrl: guide.thumbnailUrl,
          sortOrder: guide.sortOrder,
        },
      });
  }

  console.log('Tutorial quickguides seeded successfully');
};
