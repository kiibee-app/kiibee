import { contentTypes } from '../schema/content/contentTypes.schema';
import { db } from '../db';

export const seedContentTypes = async () => {
  const types = [
    {
      id: 'video',
      name: 'Video',
      description: 'Video content',
      isActive: true,
    },
    {
      id: 'audio',
      name: 'Audio',
      description: 'Audio and music content',
      isActive: true,
    },
    {
      id: 'pdf',
      name: 'PDF',
      description: 'Document in PDF format',
      isActive: true,
    },
    {
      id: 'epub',
      name: 'EPUB',
      description: 'E-book format content',
      isActive: true,
    },
    {
      id: 'web',
      name: 'Web Link',
      description: 'External web link content',
      isActive: true,
    },
  ];

  await db.insert(contentTypes).values(types).onConflictDoNothing();
};
