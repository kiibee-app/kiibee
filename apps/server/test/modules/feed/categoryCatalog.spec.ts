import { db } from 'src/database/db';
import { getLatestQuery } from 'src/modules/feed/feed.query';
import { sql } from 'drizzle-orm';

jest.mock('src/database/db', () => ({ db: { select: jest.fn() } }));

// The category catalog must not collapse a musician's uploads to one card or
// silently stop at the old 100-item feed cap.
describe('category catalog uploads', () => {
  beforeEach(() => jest.clearAllMocks());
  it.each([undefined, 12])(
    'keeps distinct uploads from the same creator (limit=%s)',
    async (limit) => {
      const all = Array.from({ length: 125 }, (_, index) => ({
        id: `upload-${index}`,
        creatorId: 'musician',
        title: `Song ${index}`,
      }));
      let selected = all;
      const applyLimit = jest.fn((count: number) => {
        selected = all.slice(0, count);
        return Promise.resolve(selected.map(({ id }) => ({ id })));
      });
      const ids: any = {
        from: () => ids,
        innerJoin: () => ids,
        where: () => ids,
        orderBy: () => ids,
        $dynamic: () => ids,
        limit: applyLimit,
        then: (resolve: any, reject: any) =>
          Promise.resolve(selected.map(({ id }) => ({ id }))).then(
            resolve,
            reject,
          ),
      };
      const rows: any = {
        from: () => rows,
        innerJoin: () => rows,
        leftJoin: () => rows,
        where: async () => [...selected, selected[0]], // Duplicate category join row.
      };
      jest.mocked(db.select).mockReturnValueOnce(ids).mockReturnValueOnce(rows);
      const result = await getLatestQuery(
        sql`true`,
        sql`published_at DESC`,
        limit,
      );
      expect(result).toHaveLength(limit ?? 125);
      expect(new Set(result.map((item) => item.id)).size).toBe(limit ?? 125);
      expect(
        result.filter((item) => item.creatorId === 'musician'),
      ).toHaveLength(limit ?? 125);
      if (limit === undefined) expect(applyLimit).not.toHaveBeenCalled();
      else expect(applyLimit).toHaveBeenCalledWith(limit);
    },
  );
});
