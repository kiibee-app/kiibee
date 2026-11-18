import { PgDialect } from 'drizzle-orm/pg-core';
import { db } from 'src/database/db';
import { reorderCollectionsService } from 'src/modules/collection/services/reorderCollections.service';

jest.mock('src/database/db', () => ({
  db: { select: jest.fn(), transaction: jest.fn() },
}));

function ownedCollections(ids: string[]) {
  const query = {
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockResolvedValue(ids.map((id) => ({ id }))),
  };
  jest.mocked(db.select).mockReturnValue(query as never);
  return query;
}

describe('collection reordering with channel passes', () => {
  beforeEach(() => jest.resetAllMocks());

  it('validates visible collections without counting the internal channel pass', async () => {
    const query = ownedCollections(['a', 'b']);
    const update = {
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue(undefined),
    };
    const tx = { update: jest.fn(() => update) };
    jest
      .mocked(db.transaction)
      .mockImplementation(async (callback) => callback(tx as never));

    await expect(
      reorderCollectionsService(['b', 'a'], 'creator'),
    ).resolves.toEqual(
      expect.objectContaining({ success: true, data: ['b', 'a'] }),
    );
    const sql = new PgDialect().sqlToQuery(query.where.mock.calls[0][0]);
    expect(sql.sql).toContain('not like');
    expect(sql.params).toContain('profile-access-%');
    expect(sql.params).toContain('creator');
    expect(update.set.mock.calls).toEqual([
      [{ sortOrder: 2 }],
      [{ sortOrder: 1 }],
      [{ manualContentOrder: true }],
    ]);
  });

  it.each([
    ['a', 'a'],
    ['a', 'foreign'],
    ['a'],
    ['a', 'profile-access-creator'],
  ])('rejects an invalid order: %j', async (...ids) => {
    ownedCollections(['a', 'b']);
    await expect(reorderCollectionsService(ids, 'creator')).rejects.toThrow();
    expect(db.transaction).not.toHaveBeenCalled();
  });
});
