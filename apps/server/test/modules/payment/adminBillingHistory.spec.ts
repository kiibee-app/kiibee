import { PgDialect } from 'drizzle-orm/pg-core';
import { db } from 'src/database/db';
import { adminBillingHistoryService } from 'src/modules/payment/services/adminBillingHistory.service';

jest.mock('src/database/db', () => ({
  db: { select: jest.fn(), execute: jest.fn() },
}));

describe('creator subscription billing history', () => {
  beforeEach(() => jest.clearAllMocks());

  it.each(['creator-a', 'creator-b', undefined])(
    'filters by creator before pagination: %s',
    async (creatorId) => {
      jest.mocked(db.execute).mockResolvedValue({ rows: [] } as never);
      await adminBillingHistoryService('subscription', '2', creatorId);
      const query = new PgDialect().sqlToQuery(
        jest.mocked(db.execute).mock.calls[0][0] as never,
      );
      expect(query.sql).toContain('UNION ALL');
      expect(query.sql).toContain('LIMIT 21 OFFSET');
      expect(query.params.at(-1)).toBe(20);
      if (creatorId) {
        expect(query.sql).toContain('b.creator_id =');
        expect(query.params).toContain(creatorId);
        expect(query.sql).not.toContain(creatorId);
      } else {
        expect(query.sql).not.toContain('b.creator_id =');
      }
    },
  );

  it.each(['subscription', 'content'])(
    'searches %s history before pagination with escaped parameters',
    async (kind) => {
      const chain = {
        from: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockResolvedValue([]),
      };
      jest
        .mocked(db.select)
        .mockReturnValue(chain as unknown as ReturnType<typeof db.select>);
      jest.mocked(db.execute).mockResolvedValue({ rows: [] } as never);
      await adminBillingHistoryService(kind, '2', undefined, 'Casper%');
      const query = new PgDialect().sqlToQuery(
        kind === 'subscription'
          ? (jest.mocked(db.execute).mock.calls[0][0] as never)
          : chain.where.mock.calls[0][0],
      );
      expect(query.sql.toLowerCase()).toContain('ilike');
      expect(query.sql).not.toContain('Casper');
      expect(query.params).toContain('%Casper\\%%');
      if (kind === 'content') expect(chain.offset).toHaveBeenCalledWith(20);
      else expect(query.params.at(-1)).toBe(20);
    },
  );

  it('rejects content history in creator scope', async () => {
    await expect(
      adminBillingHistoryService('content', '1', 'creator-a'),
    ).rejects.toMatchObject({ status: 400 });
    expect(db.select).not.toHaveBeenCalled();
  });
});
