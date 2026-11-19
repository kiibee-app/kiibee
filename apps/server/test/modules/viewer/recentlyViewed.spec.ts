import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { sql } from 'drizzle-orm';
import { PgDialect } from 'drizzle-orm/pg-core';
import { SyncRecentlyViewedDto } from 'src/modules/viewer/dto/recentlyViewed.dto';
import {
  getRecentlyViewed,
  syncRecentlyViewed,
} from 'src/modules/viewer/services/recentlyViewed.service';
import { db } from 'src/database/db';

jest.mock('src/database/db', () => ({
  db: { select: jest.fn(), insert: jest.fn(), delete: jest.fn() },
}));

const item = {
  id: 'content-1',
  title: 'Video',
  href: '/en/content/1',
  viewedAt: 100,
};

describe('account recently viewed', () => {
  beforeEach(() => jest.resetAllMocks());

  it('rejects unsafe links and oversized history imports', async () => {
    for (const items of [
      [{ ...item, href: '//external.example' }],
      Array(51).fill(item),
    ]) {
      const dto = plainToInstance(SyncRecentlyViewedDto, { items });
      expect((await validate(dto)).length).toBeGreaterThan(0);
    }
    expect(
      await validate(plainToInstance(SyncRecentlyViewedDto, { items: [item] })),
    ).toEqual([]);
  });

  it('reads only the authenticated account, independent of browser storage', async () => {
    const where = jest.fn().mockReturnValue({
      orderBy: () => ({
        limit: async () => [
          {
            contentId: item.id,
            viewedAt: 100,
            metadata: { title: item.title, href: item.href },
          },
        ],
      }),
    });
    jest
      .mocked(db.select)
      .mockReturnValue({ from: () => ({ where }) } as never);
    expect((await getRecentlyViewed('account-a')).data).toEqual([item]);
    const query = new PgDialect().sqlToQuery(where.mock.calls[0][0]);
    expect(query.params).toEqual(['account-a']);
  });

  it('imports newest duplicate once, ignores deleted content and preserves newer server visits', async () => {
    const values = jest.fn().mockReturnValue({
      onConflictDoUpdate: jest.fn().mockResolvedValue(undefined),
    });
    jest.mocked(db.insert).mockReturnValue({ values } as never);
    jest.mocked(db.delete).mockReturnValue({
      where: jest.fn().mockResolvedValue(undefined),
    } as never);
    const selects = [
      { from: () => ({ where: async () => [{ id: item.id }] }) },
      {
        from: () => ({
          where: () => ({
            orderBy: () => ({
              limit: () => sql`select content_id from recently_viewed limit 50`,
            }),
          }),
        }),
      },
      {
        from: () => ({
          where: () => ({ orderBy: () => ({ limit: async () => [] }) }),
        }),
      },
    ];
    for (const select of selects)
      jest.mocked(db.select).mockReturnValueOnce(select as never);
    await syncRecentlyViewed('account-a', [
      item,
      { ...item, viewedAt: 200 },
      { ...item, id: 'deleted' },
    ]);
    expect(values).toHaveBeenCalledWith([
      {
        userId: 'account-a',
        contentId: item.id,
        viewedAt: 200,
        metadata: { title: item.title, href: item.href },
      },
    ]);
    const update =
      values.mock.results[0].value.onConflictDoUpdate.mock.calls[0][0];
    expect(new PgDialect().sqlToQuery(update.setWhere).sql).toContain(
      'excluded.viewed_at >',
    );
  });
});
