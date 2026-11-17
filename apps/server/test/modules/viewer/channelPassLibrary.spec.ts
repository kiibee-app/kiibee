import { PgDialect } from 'drizzle-orm/pg-core';
import { db } from 'src/database/db';
import {
  getChannelPassMedia,
  getCollectionMediaItems,
  getCollectionsWithDetails,
} from 'src/modules/viewer/viewer.helper';

jest.mock('src/database/db', () => ({ db: { select: jest.fn() } }));
jest.mock('src/utils/populateMissingCollectionCovers', () => ({
  populateMissingCollectionCovers: jest.fn(),
}));

function result(rows: unknown[]) {
  const q = Object.assign(Promise.resolve(rows), {
    from: jest.fn(() => q),
    limit: jest.fn(() => q),
    innerJoin: jest.fn(() => q),
    leftJoin: jest.fn(() => q),
    where: jest.fn(() => q),
    groupBy: jest.fn(() => q),
    orderBy: jest.fn(() => q),
  });
  jest.mocked(db.select).mockReturnValueOnce(q as never);
  return q;
}

describe('channel passes in the viewer library', () => {
  beforeEach(() => jest.resetAllMocks());
  it('expands channel passes alongside ordinary collection items', async () => {
    result([{ collectionId: 'collection', mediaFileId: 'regular-file' }]);
    const channelQuery = result([
      { collectionId: 'profile-access-creator', mediaFileId: 'channel-file' },
    ]);
    await expect(
      getCollectionMediaItems(['collection', 'profile-access-creator']),
    ).resolves.toEqual([
      { collectionId: 'collection', mediaFileId: 'regular-file' },
      { collectionId: 'profile-access-creator', mediaFileId: 'channel-file' },
    ]);
    const query = new PgDialect().sqlToQuery(
      channelQuery.where.mock.calls[0][0] as never,
    );
    expect(query.sql).toContain('is_published');
    expect(query.sql).toContain('is_deleted');
    expect(query.params).toEqual(
      expect.arrayContaining(['profile-access-creator', true, false, 'public']),
    );
  });
  it.each([true, false])(
    'fills the pass count and cover (channel cover: %s)',
    async (hasCover) => {
      result([
        {
          id: 'profile-access-creator',
          creatorId: 'creator',
          name: 'Channel access',
          coverImageUrl: null,
        },
      ]);
      result([
        {
          collectionId: 'profile-access-creator',
          mediaFileId: 'a',
          thumbnailUrl: 'content.jpg',
        },
        {
          collectionId: 'profile-access-creator',
          mediaFileId: 'b',
          thumbnailUrl: null,
        },
      ]);
      result([
        {
          creatorId: 'creator',
          cover: hasCover ? 'channel.jpg' : null,
          logo: null,
        },
      ]);
      result([]);
      await expect(
        getCollectionsWithDetails(['profile-access-creator']),
      ).resolves.toEqual([
        expect.objectContaining({
          elementCount: 2,
          coverImageUrl: hasCover ? 'channel.jpg' : 'content.jpg',
        }),
      ]);
    },
  );
  it('does not query channel content for ordinary collections', async () => {
    await expect(getChannelPassMedia(['ordinary'])).resolves.toEqual([]);
    expect(db.select).not.toHaveBeenCalled();
  });
});

import { getPublicCollectionService } from 'src/modules/content/services/getPublicCollection.service';
jest.mock('src/utils/publicCreatorVisibility', () => ({
  ...jest.requireActual('src/utils/publicCreatorVisibility'),
  requirePubliclyVisibleCreator: jest.fn().mockResolvedValue({ id: 'creator' }),
}));
describe('opening a channel pass from the library', () => {
  beforeEach(() => jest.resetAllMocks());
  const pass = {
    id: 'profile-access-creator',
    creatorId: 'creator',
    name: 'Channel access',
    isDeleted: false,
  };
  it('does not expose channel items without an active entitlement', async () => {
    result([pass]);
    await expect(getPublicCollectionService(pass.id)).rejects.toMatchObject({
      status: 403,
    });
    expect(db.select).toHaveBeenCalledTimes(1);
  });
  it('loads published channel content for an entitled viewer without collection membership rows', async () => {
    result([pass]);
    const access = result([{ id: 'grant' }]);
    result([{ accessType: 'free' }]);
    const content = result([
      {
        id: 'video',
        title: 'Video',
        creatorId: 'creator',
        createdAt: new Date(),
      },
    ]);
    result([{ id: 'creator', name: 'Creator', slug: 'creator' }]);
    const response = await getPublicCollectionService(pass.id, 'viewer');
    expect(response.data).toMatchObject({
      items: [{ id: 'video', collectionId: pass.id }],
    });
    const dialect = new PgDialect();
    const accessSql = dialect.sqlToQuery(
      access.where.mock.calls[0][0] as never,
    );
    expect(accessSql.params).toContain('completed');
    const itemSql = dialect.sqlToQuery(content.where.mock.calls[0][0] as never);
    expect(itemSql.params).toEqual(
      expect.arrayContaining(['creator', true, false, 'public']),
    );
    expect(itemSql.sql).not.toContain('collection_items');
  });
});
