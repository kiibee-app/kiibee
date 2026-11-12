jest.mock('src/database/db', () => ({
  db: { select: jest.fn(), transaction: jest.fn() },
}));
import { db } from 'src/database/db';
import {
  analyticsEvents,
  collectionItems,
  mediaFiles,
  userContentAccess,
} from 'src/database/schema';
import {
  recordRentalStream,
  getRentalStreamInfo,
} from 'src/modules/media/services/rentalStreamLimit';

const media = { id: 'video', creatorId: 'creator', accessType: 'paid' };
let access: any[];
let counts: Record<string, number>;
const execute = jest.fn();
const select = () => {
  let table: any;
  const result = () =>
    table === mediaFiles
      ? [media]
      : table === collectionItems
        ? []
        : table === userContentAccess
          ? access
          : [{ count: counts[access[0]?.id] ?? 0 }];
  const chain: any = {
    from: (t: any) => {
      table = t;
      return chain;
    },
    where: () => chain,
    limit: async () => result(),
    orderBy: async () => result(),
    then: (yes: any, no: any) => Promise.resolve(result()).then(yes, no),
  };
  return chain;
};
describe('rental stream quota', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    counts = {};
    access = [{ id: 'rental-1', accessType: 'rented' }];
    jest.mocked(db.select).mockImplementation(select);
    jest.mocked(db.transaction).mockImplementation(async (fn: any) =>
      fn({
        select,
        execute,
        insert: () => ({
          values: async (event: any) => {
            expect(event.referrer).toBe(`rental-stream:${access[0].id}`);
            counts[access[0].id] = (counts[access[0].id] ?? 0) + 1;
          },
        }),
      }),
    );
  });
  it('reports the remaining count without consuming a session', async () => {
    counts['rental-1'] = 2;
    expect(await getRentalStreamInfo('viewer', 'video')).toEqual({
      usedStreams: 2,
      maxStreams: 7,
      remainingStreams: 5,
    });
    expect(counts['rental-1']).toBe(2);
    await recordRentalStream('viewer', 'key');
    expect(
      (await getRentalStreamInfo('viewer', 'video'))?.remainingStreams,
    ).toBe(4);
  });
  it('returns no rental counter for purchased access', async () => {
    access = [{ id: 'purchase', accessType: 'purchased' }];
    expect(await getRentalStreamInfo('viewer', 'video')).toBeNull();
  });
  it('permits seven sessions and rejects the eighth', async () => {
    for (let i = 0; i < 7; i++) await recordRentalStream('viewer', 'key');
    await expect(recordRentalStream('viewer', 'key')).rejects.toMatchObject({
      status: 403,
    });
    expect(counts['rental-1']).toBe(7);
    expect(execute).toHaveBeenCalledTimes(8);
  });
  it('starts a new allowance for a later rental', async () => {
    counts['rental-1'] = 7;
    access = [{ id: 'rental-2', accessType: 'rented' }];
    await recordRentalStream('viewer', 'key');
    expect(counts['rental-2']).toBe(1);
  });
  it('does not cap purchases even when a rental also exists', async () => {
    counts['rental-1'] = 7;
    access.push({ id: 'purchase', accessType: 'purchased' });
    await recordRentalStream('viewer', 'key');
    expect(counts['rental-1']).toBe(7);
  });
  it.each([
    ['creator', undefined],
    ['viewer', 'admin'],
  ])('does not consume quota for previews', async (userId, role) => {
    await recordRentalStream(userId!, 'key', role);
    expect(db.transaction).not.toHaveBeenCalled();
  });
});
