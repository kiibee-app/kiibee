import { db } from 'src/database/db';
import { mediaFileCategories, mediaFiles } from 'src/database/schema';
import { updateAdminContentCategoryService } from 'src/modules/content/services/updateAdminContentCategory.service';
jest.mock('src/database/db', () => ({ db: { transaction: jest.fn() } }));
function setup(rows: unknown[][]) {
  const operations: unknown[] = [];
  const tx = {
    select: jest.fn(() => {
      const data = rows.shift();
      const q = {
        from: () => q,
        where: () => q,
        limit: () => q,
        for: () => q,
        then: (resolve: any) => Promise.resolve(data).then(resolve),
      };
      return q;
    }),
    delete: jest.fn((table) => ({
      where: async () => {
        operations.push(['delete', table]);
      },
    })),
    insert: jest.fn((table) => ({
      values: async (values: unknown) => {
        operations.push(['insert', table, values]);
      },
    })),
    update: jest.fn((table) => ({
      set: (values: unknown) => ({
        where: async () => {
          operations.push(['update', table, values]);
        },
      }),
    })),
  };
  jest.mocked(db.transaction).mockImplementation(async (fn: any) => fn(tx));
  return { tx, operations };
}
beforeEach(() => jest.resetAllMocks());
it('replaces all old categories with one content category, leaving creator categories untouched', async () => {
  const { operations } = setup([[{ id: 'content' }], [{ id: 'education' }]]);
  const result = await updateAdminContentCategoryService(
    'content',
    'education',
  );
  expect(result.data).toEqual({
    contentId: 'content',
    categoryId: 'education',
  });
  expect(operations).toEqual([
    ['delete', mediaFileCategories],
    [
      'insert',
      mediaFileCategories,
      expect.objectContaining({
        mediaFileId: 'content',
        categoryId: 'education',
      }),
    ],
    [
      'update',
      mediaFiles,
      expect.objectContaining({ updatedAt: expect.any(Date) }),
    ],
  ]);
});
it('does not delete old category associations if the new category is invalid or inactive', async () => {
  const { operations } = setup([[{ id: 'content' }], []]);
  await expect(
    updateAdminContentCategoryService('content', 'invalid'),
  ).rejects.toThrow('Invalid category');
  expect(operations).toEqual([]);
});
it('rejects missing or deleted content without writing', async () => {
  const { operations } = setup([[]]);
  await expect(
    updateAdminContentCategoryService('missing', 'education'),
  ).rejects.toThrow('Content not found');
  expect(operations).toEqual([]);
});
