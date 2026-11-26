import { db } from 'src/database/db';
import { userContentCategory } from 'src/database/schema';
import {
  getAdminCreatorAppearanceService,
  updateAdminCreatorAppearanceService,
} from 'src/modules/content/services/adminCreatorAppearance.service';
import {
  getContentAppearanceService,
  writeContentAppearance,
} from 'src/modules/content/services/contentAppearance.service';

jest.mock('src/database/db', () => ({
  db: { transaction: jest.fn(), select: jest.fn() },
}));
jest.mock('src/modules/content/services/contentAppearance.service', () => ({
  getContentAppearanceService: jest.fn(),
  writeContentAppearance: jest.fn(),
}));
function query(rows: unknown[]) {
  const q = {
    from: () => q,
    where: () => q,
    limit: () => q,
    for: () => q,
    then: (resolve: (value: unknown[]) => unknown) =>
      Promise.resolve(rows).then(resolve),
  };
  return q;
}
function setup(rows: unknown[][]) {
  const writes: { table: unknown; values: unknown }[] = [];
  const tx = {
    select: jest.fn(() => query(rows.shift() ?? [])),
    update: jest.fn((table) => ({
      set: (values: unknown) => {
        writes.push({ table, values });
        return { where: async () => [] };
      },
    })),
    insert: jest.fn((table) => ({
      values: async (values: unknown) => {
        writes.push({ table, values });
      },
    })),
  };
  jest.mocked(db.transaction).mockImplementation(async (fn: any) => fn(tx));
  jest
    .mocked(writeContentAppearance)
    .mockResolvedValue({ id: 'appearance' } as any);
  return { tx, writes };
}
beforeEach(() => jest.resetAllMocks());
it('replaces creator categories and saves appearance in the same transaction', async () => {
  const { tx, writes } = setup([
    [{ id: 'creator' }],
    [{ id: 'music' }],
    [{ id: 'selection' }],
  ]);
  await updateAdminCreatorAppearanceService('creator', {
    categoryIds: ['music'],
    layout: 'layout2',
  });
  expect(writes).toEqual([
    {
      table: userContentCategory,
      values: expect.objectContaining({ categoryIds: ['music'] }),
    },
  ]);
  expect(writeContentAppearance).toHaveBeenCalledWith(
    tx,
    'creator',
    expect.objectContaining({ layout: 'layout2' }),
  );
});
it('creates a first category assignment', async () => {
  const { writes } = setup([[{ id: 'creator' }], [{ id: 'music' }], []]);
  await updateAdminCreatorAppearanceService('creator', {
    categoryIds: ['music'],
  });
  expect(writes[0]).toEqual({
    table: userContentCategory,
    values: expect.objectContaining({
      userId: 'creator',
      categoryIds: ['music'],
    }),
  });
});
it('preserves existing categories when only appearance is changed', async () => {
  const { writes } = setup([[{ id: 'creator' }]]);
  await updateAdminCreatorAppearanceService('creator', { layout: 'layout3' });
  expect(writes).toHaveLength(0);
});
it('allows removing selected categories without changing user status or content types', async () => {
  const { writes } = setup([[{ id: 'creator' }], [{ id: 'selection' }]]);
  await updateAdminCreatorAppearanceService('creator', { categoryIds: [] });
  expect(writes).toEqual([
    {
      table: userContentCategory,
      values: expect.objectContaining({ categoryIds: [] }),
    },
  ]);
});
it('rejects unknown category IDs before either settings record is written', async () => {
  const { writes } = setup([[{ id: 'creator' }], []]);
  await expect(
    updateAdminCreatorAppearanceService('creator', {
      categoryIds: ['invalid'],
    }),
  ).rejects.toThrow('Invalid category');
  expect(writes).toHaveLength(0);
  expect(writeContentAppearance).not.toHaveBeenCalled();
});
it('rejects a missing or non-creator account', async () => {
  setup([[]]);
  await expect(
    updateAdminCreatorAppearanceService('viewer', { categoryIds: [] }),
  ).rejects.toThrow('Creator not found');
  expect(writeContentAppearance).not.toHaveBeenCalled();
});
it('returns saved category selections alongside appearance', async () => {
  jest.mocked(getContentAppearanceService).mockResolvedValue({
    success: true,
    statusCode: 200,
    message: 'ok',
    data: { layout: 'layout1' },
  } as any);
  jest
    .mocked(db.select)
    .mockReturnValue(query([{ categoryIds: ['music', 'art'] }]) as any);
  expect(
    (await getAdminCreatorAppearanceService('creator')).data,
  ).toMatchObject({ layout: 'layout1', categoryIds: ['music', 'art'] });
});

it('rejects multiple creator categories', async () => {
  const { writes } = setup([[{ id: 'creator' }]]);
  await expect(
    updateAdminCreatorAppearanceService('creator', {
      categoryIds: ['music', 'art'],
    }),
  ).rejects.toThrow('Choose one creator category');
  expect(writes).toHaveLength(0);
  expect(writeContentAppearance).not.toHaveBeenCalled();
});
