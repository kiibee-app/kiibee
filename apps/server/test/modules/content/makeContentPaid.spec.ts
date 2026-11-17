import { db } from 'src/database/db';
import { makeContentPaidService } from 'src/modules/content/services/makeContentPaid.service';
jest.mock('src/database/db', () => ({
  db: {
    update: jest.fn(),
    select: jest.fn(),
    transaction: jest.fn(),
    query: { mediaFiles: { findFirst: jest.fn() } },
  },
}));
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

import { getProfilePaymentState } from 'src/utils/profilePayment';
import { CheckMediaAccessGuard } from 'src/middleware/CheckMediaAccess';
import {
  createOrUpdateContentSetting,
  getContentSettingByUserId,
} from 'src/modules/content/services/contentSetting.service';
import { collections } from 'src/database/schema';
import type { ExecutionContext } from '@nestjs/common';
describe('whole-channel paid access', () => {
  function rows(data: unknown[]) {
    const q = {
      from: () => q,
      innerJoin: () => q,
      where: () => q,
      limit: async () => data,
    };
    return q as never;
  }
  beforeEach(() => jest.clearAllMocks());
  it.each([false, true])(
    'requires a channel entitlement (granted %s)',
    async (granted) => {
      jest
        .mocked(db.select)
        .mockReturnValueOnce(rows([{ accessType: 'payment' }]))
        .mockReturnValueOnce(
          rows([
            {
              id: 'profile-access-creator',
              buyPrice: '16',
              rentPrice: '8',
              rentDuration: '1_month',
            },
          ]),
        )
        .mockReturnValueOnce(rows(granted ? [{ id: 'grant' }] : []));
      await expect(
        getProfilePaymentState('creator', 'viewer'),
      ).resolves.toMatchObject({
        required: true,
        hasAccess: granted,
        buyPrice: '16',
        rentDuration: '1_month',
      });
    },
  );
  it('blocks direct playback of a free item on an unpaid channel', async () => {
    jest.mocked(db.query.mediaFiles.findFirst).mockResolvedValue({
      id: 'media',
      creatorId: 'creator',
      accessType: 'free',
      isDeleted: false,
    } as never);
    jest
      .mocked(db.select)
      .mockReturnValueOnce(rows([{ accessType: 'payment' }]))
      .mockReturnValueOnce(rows([{ id: 'profile-access-creator' }]))
      .mockReturnValueOnce(rows([]));
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { userId: 'viewer', role: 'viewer' },
          params: { id: 'media' },
        }),
      }),
    } as ExecutionContext;
    await expect(
      new CheckMediaAccessGuard().canActivate(context),
    ).rejects.toMatchObject({ status: 403 });
  });
  it('persists profile prices and period with the access setting atomically', async () => {
    const pass = jest
      .fn()
      .mockReturnValue({ onConflictDoUpdate: async () => undefined });
    const setting = jest.fn().mockReturnValue({
      returning: async () => [{ userId: 'creator', accessType: 'payment' }],
    });
    const tx = {
      select: () => rows([]),
      insert: (table: unknown) => ({
        values: table === collections ? pass : setting,
      }),
    };
    jest
      .mocked(db.transaction)
      .mockImplementation(async (callback) => callback(tx as never));
    await expect(
      createOrUpdateContentSetting('creator', {
        accessType: 'payment',
        buyPrice: 16,
        rentPrice: 8,
        rentDuration: '3_months',
      }),
    ).resolves.toMatchObject({ success: true });
    expect(pass).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'profile-access-creator',
        buyPrice: '16',
        rentPrice: '8',
        rentDuration: '3_months',
        visibility: 'draft',
        isPublished: false,
      }),
    );
    expect(setting).toHaveBeenCalledWith(
      expect.objectContaining({ accessType: 'payment', userId: 'creator' }),
    );
  });
  it('returns persisted prices to another browser', async () => {
    jest
      .mocked(db.select)
      .mockReturnValueOnce(rows([{ userId: 'creator', accessType: 'payment' }]))
      .mockReturnValueOnce(
        rows([{ buyPrice: '16', rentPrice: '8', rentDuration: '6_months' }]),
      );
    await expect(getContentSettingByUserId('creator')).resolves.toMatchObject({
      data: { buyPrice: '16', rentPrice: '8', rentDuration: '6_months' },
    });
  });
});

import { getSingleContentService } from 'src/modules/content/services/getSingleContent.service';
jest.mock(
  'src/modules/creator-overview/services/insertPageVisit.service',
  () => ({
    insertPageVisitService: jest.fn().mockResolvedValue(undefined),
  }),
);
describe('single content channel-pass entitlement', () => {
  it.each(['purchased', 'rented'])(
    'exposes the %s channel grant without another purchase',
    async (accessType) => {
      const grant = {
        id: 'pass-grant',
        accessType,
        grantedAt: new Date(),
        rentExpiresAt:
          accessType === 'rented' ? new Date(Date.now() + 86400000) : null,
      };
      const rows = [
        [
          {
            id: 'content',
            slug: 'content',
            title: 'Content',
            creatorId: 'creator',
            isPublished: true,
            visibility: 'public',
            isDeleted: false,
          },
        ],
        [],
        accessType === 'purchased'
          ? [
              {
                accessType: 'rented',
                grantedAt: new Date(),
                rentExpiresAt: new Date(Date.now() + 86400000),
              },
            ]
          : [],
        [],
        [{ slug: 'creator', isHidden: false, isDeleted: false }],
        [],
        [{ accessType: 'payment' }],
        [{ id: 'profile-access-creator' }],
        [grant],
        [],
        [],
      ];
      jest.mocked(db.select).mockReset();
      for (const result of rows) {
        const q = Object.assign(Promise.resolve(result), {
          from: () => q,
          where: () => q,
          innerJoin: () => q,
          leftJoin: () => q,
          limit: () => q,
        });
        jest.mocked(db.select).mockReturnValueOnce(q as never);
      }
      const response = await getSingleContentService('content', 'viewer');
      expect(response.data.accessInfo).toMatchObject({
        accessType,
        rentExpiresAt: grant.rentExpiresAt,
      });
      expect(jest.mocked(db.select)).toHaveBeenCalledTimes(rows.length);
    },
  );
});
