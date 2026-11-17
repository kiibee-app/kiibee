import { db } from 'src/database/db';
import { makeContentPaidService } from 'src/modules/content/services/makeContentPaid.service';
jest.mock('src/database/db', () => ({ db: { update: jest.fn() } }));
describe('admin free to paid', () => {
  const set = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    set.mockReturnValue({
      where: () => ({
        returning: async () => [{ id: 'content', accessType: 'paid' }],
      }),
    });
    jest
      .mocked(db.update)
      .mockReturnValue({ set } as unknown as ReturnType<typeof db.update>);
  });
  it.each([
    [
      { rentPrice: 19 },
      { buyPrice: null, rentPrice: '19.00', rentDurationHours: 48 },
    ],
    [
      { buyPrice: 39 },
      { buyPrice: '39.00', rentPrice: null, rentDurationHours: null },
    ],
    [
      { rentPrice: 19, rentDurationHours: 48 },
      { buyPrice: null, rentPrice: '19.00', rentDurationHours: 48 },
    ],
  ])(
    'sets paid pricing without touching existing purchases',
    async (input, expected) => {
      await expect(
        makeContentPaidService('content', input),
      ).resolves.toMatchObject({ success: true });
      expect(set).toHaveBeenCalledWith(
        expect.objectContaining({
          ...expected,
          accessType: 'paid',
          passwordHash: null,
        }),
      );
      expect(Object.keys(set.mock.calls[0][0]).sort()).toEqual(
        [
          'accessType',
          'buyPrice',
          'passwordHash',
          'rentDurationHours',
          'rentPrice',
          'updatedAt',
        ].sort(),
      );
    },
  );
  it.each([
    {},
    { buyPrice: -1 },
    { buyPrice: 0 },
    { buyPrice: 1.001 },
    { rentPrice: 19, rentDurationHours: 0 },
  ])('rejects invalid pricing before updating content: %j', async (input) => {
    await expect(
      makeContentPaidService('content', input),
    ).rejects.toMatchObject({ status: 400 });
    expect(db.update).not.toHaveBeenCalled();
  });
});
