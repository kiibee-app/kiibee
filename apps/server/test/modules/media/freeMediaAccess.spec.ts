import { PgDialect } from 'drizzle-orm/pg-core';
import { db } from 'src/database/db';
import { assertFreeMediaAccess } from 'src/modules/media/services/freeMediaAccess';

jest.mock('src/database/db', () => ({ db: { select: jest.fn() } }));

describe('guest free media access', () => {
  const where = jest.fn().mockReturnThis();
  const limit = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(db.select).mockReturnValue({
      from: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      where,
      limit,
    } as unknown as ReturnType<typeof db.select>);
  });

  it('restricts public URLs to published free files outside gated collections', async () => {
    limit.mockResolvedValue([{ id: 'free-file' }]);
    await expect(assertFreeMediaAccess('file-key')).resolves.toBeUndefined();
    const query = new PgDialect().sqlToQuery(where.mock.calls[0][0]);
    expect(query.params).toContain('file-key');
    expect(query.params).toContain('free');
    expect(query.params).toContain('public');
    expect(query.sql).toContain('"media_files"."is_published"');
    expect(query.sql).toContain('"media_files"."is_deleted"');
    expect(query.sql).toContain('NOT EXISTS');
    expect(query.sql).toContain('"collections"."access_type"');
    expect(query.sql).toContain('"collections"."buy_price"');
    expect(query.sql).toContain('"collections"."rent_price"');
  });

  it('rejects files that do not satisfy the public access rules', async () => {
    limit.mockResolvedValue([]);
    await expect(assertFreeMediaAccess('protected-file')).rejects.toMatchObject(
      { status: 403 },
    );
  });
});
