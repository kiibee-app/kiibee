import { and, eq } from 'drizzle-orm';
import { PgDialect } from 'drizzle-orm/pg-core';
import { db } from 'src/database/db';
import { subscriptionPaymentsHistory } from 'src/database/schema';
import { adminBillingHistoryService } from 'src/modules/payment/services/adminBillingHistory.service';

jest.mock('src/database/db', () => ({ db: { select: jest.fn() } }));

describe('creator subscription billing history', () => {
  beforeEach(() => jest.clearAllMocks());

  it.each(['creator-a', 'creator-b', undefined])(
    'filters by creator before pagination: %s',
    async (creatorId) => {
      const chain = {
        from: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockResolvedValue([]),
      };
      jest
        .mocked(db.select)
        .mockReturnValue(chain as unknown as ReturnType<typeof db.select>);
      await adminBillingHistoryService('subscription', '2', creatorId);
      expect(chain.where).toHaveBeenCalledWith(
        and(
          creatorId
            ? eq(subscriptionPaymentsHistory.creatorId, creatorId)
            : undefined,
        ),
      );
      expect(chain.offset).toHaveBeenCalledWith(20);
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
      await adminBillingHistoryService(kind, '2', undefined, 'Casper%');
      const query = new PgDialect().sqlToQuery(chain.where.mock.calls[0][0]);
      expect(query.sql).toContain('ilike');
      expect(query.sql).not.toContain('Casper');
      expect(query.params).toContain('%Casper\\%%');
      expect(chain.offset).toHaveBeenCalledWith(20);
    },
  );

  it('rejects content history in creator scope', async () => {
    await expect(
      adminBillingHistoryService('content', '1', 'creator-a'),
    ).rejects.toMatchObject({ status: 400 });
    expect(db.select).not.toHaveBeenCalled();
  });
});
