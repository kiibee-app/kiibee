jest.mock('src/database/db', () => ({
  db: { select: jest.fn(), insert: jest.fn() },
}));
jest.mock('src/utils/passwordHash', () => ({ comparePassword: jest.fn() }));
import { db } from 'src/database/db';
import { comparePassword } from 'src/utils/passwordHash';
import {
  getChannelCodeState,
  redeemChannelCode,
} from 'src/utils/channelCodeAccess';

function rows(...results: any[][]) {
  for (const result of results) {
    const chain: any = {
      from: () => chain,
      where: () => chain,
      limit: async () => result,
    };
    jest.mocked(db.select).mockReturnValueOnce(chain);
  }
}
const insertResult = (result: any[]) => {
  const returning = jest.fn().mockResolvedValue(result);
  const values = jest
    .fn()
    .mockReturnValue({ onConflictDoNothing: () => ({ returning }) });
  jest.mocked(db.insert).mockReturnValue({ values } as any);
  return values;
};
describe('channel code access', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers().setSystemTime(new Date('2026-01-01T00:00:00Z'));
  });
  afterEach(() => jest.useRealTimers());
  it('starts a 30-day grant when a valid code is first redeemed', async () => {
    rows([{ passwordHash: 'hash' }]);
    jest.mocked(comparePassword).mockResolvedValue(true);
    const values = insertResult([{ id: 'grant' }]);
    await redeemChannelCode('creator', 'viewer', 'code', '1_month');
    expect(values).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'viewer',
        expiresAt: new Date('2026-01-31T00:00:00Z'),
      }),
    );
  });
  it('does not extend an expired grant when the same user re-enters the code', async () => {
    rows([{ passwordHash: 'hash' }], [{ expiresAt: new Date('2025-12-31') }]);
    jest.mocked(comparePassword).mockResolvedValue(true);
    insertResult([]);
    expect(
      await redeemChannelCode('creator', 'viewer', 'code', '1_month'),
    ).toBeNull();
  });
  it('keeps the original expiry on repeated redemption before expiry', async () => {
    const existing = { expiresAt: new Date('2026-01-10') };
    rows([{ passwordHash: 'hash' }], [existing]);
    jest.mocked(comparePassword).mockResolvedValue(true);
    insertResult([]);
    expect(
      await redeemChannelCode('creator', 'viewer', 'code', '1_month'),
    ).toEqual(existing);
  });
  it('issues unlimited access when no period is selected', async () => {
    rows([{ passwordHash: 'hash' }]);
    jest.mocked(comparePassword).mockResolvedValue(true);
    const values = insertResult([{ id: 'unlimited', expiresAt: null }]);
    await redeemChannelCode('creator', 'viewer', 'code', null);
    expect(values).toHaveBeenCalledWith(
      expect.objectContaining({ expiresAt: null }),
    );
  });
  it('keeps an existing unlimited grant valid on repeat redemption', async () => {
    const existing = { expiresAt: null };
    rows([{ passwordHash: 'hash' }], [existing]);
    jest.mocked(comparePassword).mockResolvedValue(true);
    insertResult([]);
    expect(await redeemChannelCode('creator', 'viewer', 'code', null)).toEqual(
      existing,
    );
  });
  it('returns no public period when the creator has not selected one', async () => {
    rows(
      [{ accessType: 'set_password', passwordHash: null }],
      [{ isDeleted: false }],
      [{ rentDuration: null }],
    );
    expect((await getChannelCodeState('creator'))?.rentDuration).toBeNull();
  });
  it('lets the owner preview their channel without querying viewer grants', async () => {
    rows(
      [{ accessType: 'set_password', passwordHash: 'hash' }],
      [{ isDeleted: false }],
      [{ rentDuration: null }],
    );
    expect((await getChannelCodeState('creator', 'creator'))?.hasAccess).toBe(
      true,
    );
    expect(db.select).toHaveBeenCalledTimes(3);
  });
  it('rejects the wrong code without issuing a grant', async () => {
    rows([{ passwordHash: 'hash' }]);
    jest.mocked(comparePassword).mockResolvedValue(false);
    expect(
      await redeemChannelCode('creator', 'viewer', 'wrong', '1_month'),
    ).toBeNull();
    expect(db.insert).not.toHaveBeenCalled();
  });
  it('rejects a deleted creator even if the viewer previously had a grant', async () => {
    rows(
      [{ accessType: 'set_password', passwordHash: 'hash' }],
      [{ isDeleted: true }],
      [{ rentDuration: '1_month' }],
    );
    expect((await getChannelCodeState('creator', 'viewer'))?.hasAccess).toBe(
      false,
    );
    expect(db.select).toHaveBeenCalledTimes(3);
  });
  it('does not reuse grants when all access codes have been removed', async () => {
    rows(
      [{ accessType: 'set_password', passwordHash: null }],
      [{ isDeleted: false }],
      [{ rentDuration: '1_month' }],
    );
    expect((await getChannelCodeState('creator', 'viewer'))?.hasAccess).toBe(
      false,
    );
    expect(db.select).toHaveBeenCalledTimes(3);
  });
});
