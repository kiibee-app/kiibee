import { db } from 'src/database/db';
import { mediaFileCategories } from 'src/database/schema';
import { updateContentService } from 'src/modules/content/services/updateContent.service';

jest.mock('src/database/db', () => ({ db: { transaction: jest.fn() } }));

function setup(categoryExists = true) {
  const associations = ['books', 'education'];
  const results = [
    [{ id: 'content', title: 'Title', isPublished: true }],
    categoryExists ? [{ id: 'education' }] : [],
  ];
  const tx = {
    select: jest.fn(() => {
      const rows = results.shift();
      const q = {
        from: () => q,
        where: () => q,
        limit: () => q,
        for: () => q,
        then: (resolve: (value: unknown) => unknown) =>
          Promise.resolve(rows).then(resolve),
      };
      return q;
    }),
    update: jest.fn((table) => ({
      set: ({ categoryId }: { categoryId?: string }) => ({
        where: async () => {
          if (table === mediaFileCategories && categoryId) {
            throw new Error('duplicate media/category pair');
          }
        },
      }),
    })),
    delete: jest.fn(() => ({
      where: async () => {
        associations.length = 0;
      },
    })),
    insert: jest.fn(() => ({
      values: async ({ categoryId }: { categoryId: string }) => {
        associations.push(categoryId);
      },
    })),
  };
  jest.mocked(db.transaction).mockImplementation(async (fn: any) => fn(tx));
  return { tx, associations };
}
beforeEach(() => jest.resetAllMocks());
it('replaces multiple old categories, including the selected category, with one association', async () => {
  const { associations } = setup();
  const result = await updateContentService(
    'content',
    { categoryId: 'education' },
    'creator',
  );
  expect(result.success).toBe(true);
  expect(associations).toEqual(['education']);
});
it('rejects unknown or inactive categories before replacing associations', async () => {
  const { tx, associations } = setup(false);
  await expect(
    updateContentService('content', { categoryId: 'invalid' }, 'creator'),
  ).rejects.toThrow('Invalid category');
  expect(tx.delete).not.toHaveBeenCalled();
  expect(associations).toEqual(['books', 'education']);
});
