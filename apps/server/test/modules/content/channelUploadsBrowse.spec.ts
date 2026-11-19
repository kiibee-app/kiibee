import { PgDialect } from 'drizzle-orm/pg-core';
import { db } from 'src/database/db';
import { getAllContentsService } from 'src/modules/content/services/getAllContents.service';

jest.mock('src/database/db', () => ({ db: { select: jest.fn() } }));

function catalogQuery() {
  const q = Object.assign(Promise.resolve([]), {
    from: jest.fn(() => q),
    innerJoin: jest.fn(() => q),
    leftJoin: jest.fn(() => q),
    where: jest.fn(() => q),
    orderBy: jest.fn(() => q),
    limit: jest.fn(() => q),
  });
  jest.mocked(db.select).mockReturnValueOnce(q as never);
  return q;
}

const dialect = new PgDialect();

describe('channel upload catalog visibility', () => {
  beforeEach(() => jest.clearAllMocks());

  it('lists published public cards on a paid channel and masks inaccessible media', async () => {
    const q = catalogQuery();
    await getAllContentsService(24, '', 'upload', { creatorId: 'creator' });
    const where = dialect.sqlToQuery(q.where.mock.calls[0][0] as never);
    expect(where.sql).not.toContain('user_content_access');
    expect(where.sql).toContain('is_published');
    expect(where.sql).toContain('is_deleted');
    expect(where.params).toEqual(expect.arrayContaining(['creator', 'public']));
    const selection = jest.mocked(db.select).mock.calls[0][0] as any;
    const media = dialect.sqlToQuery(selection.contentUrl);
    expect(media.sql).toContain('CASE WHEN');
    expect(media.sql).toContain('ELSE NULL');
    expect(media.sql).toContain('content_settings');
    expect(media.sql).toContain("'payment', 'paid'");
  });

  it('keeps channel pass filtering on general feeds', async () => {
    const q = catalogQuery();
    await getAllContentsService();
    const where = dialect.sqlToQuery(q.where.mock.calls[0][0] as never);
    expect(where.sql).toContain('content_settings');
    expect(where.sql).toContain("'payment', 'paid'");
  });
});
