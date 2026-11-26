import { db } from 'src/database/db';
import { createSubscriptionService } from 'src/modules/subscription/services/createSubscription.service';
import { sendTemplateEmail } from 'src/lib/sendTemplateEmail';

const mockEpayPost = jest.fn();
jest.mock('axios', () => ({
  create: () => ({ post: (...args: unknown[]) => mockEpayPost(...args) }),
}));
jest.mock('src/database/db', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    query: {
      users: { findFirst: jest.fn() },
      subscriptions: { findFirst: jest.fn() },
    },
  },
}));
jest.mock(
  'src/modules/subscription/services/adminBillingRequest.service',
  () => ({ updatePendingCheckoutAmount: jest.fn() }),
);
jest.mock('src/modules/subscription/services/deleteSubscription.service');
jest.mock('src/lib/sendTemplateEmail', () => ({
  sendTemplateEmail: jest.fn(),
}));
jest.mock('src/utils/webhookUrl', () => ({
  getSubscriptionWebhookUrl: () => 'https://example.com/webhook',
}));

function rows(value: unknown[]) {
  const query = {
    from: () => query,
    where: () => query,
    orderBy: () => query,
    limit: async () => value,
  };
  return query as never;
}
describe('custom price on a free base plan', () => {
  beforeEach(() => jest.clearAllMocks());
  it.each(['draft', 'pending'])(
    'creates a 100 DKK paid ePay checkout for a %s offer, never a free activation',
    async (status) => {
      jest
        .mocked(db.select)
        .mockReturnValueOnce(
          rows([{ id: 'try', name: 'Try Kiibee', price: 0, currency: 'DKK' }]),
        )
        .mockReturnValueOnce(
          rows([
            {
              planId: 'try',
              customPrice: 100,
              paymentPeriod: '1',
              customSubscriptionRevision: 1,
              customSubscriptionStatus: status,
            },
          ]),
        );
      jest.mocked(db.query.users.findFirst).mockResolvedValue({
        id: 'creator',
        fullName: 'Test Creator',
        email: 'creator@example.com',
      } as never);
      const saveCheckout = jest.fn().mockResolvedValue(undefined);
      jest.mocked(db.insert).mockReturnValue({ values: saveCheckout } as never);
      mockEpayPost
        .mockResolvedValueOnce({
          data: { billingPlan: { id: 'custom-billing-plan' } },
        })
        .mockResolvedValueOnce({
          data: { paymentWindowUrl: 'https://example.com/payment' },
        });
      await expect(
        createSubscriptionService({
          userId: 'creator',
          planId: 'try',
          billingMonths: 1,
        }),
      ).resolves.toMatchObject({
        success: true,
        data: { paymentWindowUrl: 'https://example.com/payment' },
      });
      expect(mockEpayPost).toHaveBeenNthCalledWith(
        1,
        '/public/api/v1/subscriptions/billing/plans',
        expect.objectContaining({ amount: 12500 }),
        expect.anything(),
      );
      expect(mockEpayPost).toHaveBeenNthCalledWith(
        2,
        '/public/api/v1/cit',
        expect.objectContaining({
          amount: 12500,
          subscription: expect.objectContaining({ amount: 12500 }),
        }),
        expect.anything(),
      );
      expect(saveCheckout).toHaveBeenCalledWith(
        expect.objectContaining({
          amountMinor: 12500,
          subtotalMinor: 10000,
          vatMinor: 2500,
          vatRate: 25,
          customRevision: 1,
        }),
      );
      expect(db.update).not.toHaveBeenCalled();
      expect(sendTemplateEmail).not.toHaveBeenCalled();
    },
  );
});

describe('VAT on standard and term subscription checkout amounts', () => {
  beforeEach(() => jest.clearAllMocks());
  it.each([
    { base: 129, overrides: {}, months: 1, net: 129, gross: 16125 },
    { base: 399, overrides: {}, months: 1, net: 399, gross: 49875 },
    {
      base: 129,
      overrides: { customPrice6: 474, paymentPeriod: '6' },
      months: 6,
      net: 474,
      gross: 59250,
    },
  ])(
    'charges gross amount $gross for net $net',
    async ({ base, overrides, months, net, gross }) => {
      jest
        .mocked(db.select)
        .mockReturnValueOnce(
          rows([{ id: 'plan', name: 'Pro', price: base, currency: 'DKK' }]),
        )
        .mockReturnValueOnce(
          rows([
            { planId: 'plan', customSubscriptionStatus: 'paid', ...overrides },
          ]),
        );
      jest.mocked(db.query.users.findFirst).mockResolvedValue({
        id: 'creator',
        fullName: 'Test Creator',
        email: 'creator@example.com',
      } as never);
      const saveCheckout = jest.fn().mockResolvedValue(undefined);
      jest.mocked(db.insert).mockReturnValue({ values: saveCheckout } as never);
      mockEpayPost
        .mockResolvedValueOnce({
          data: { billingPlan: { id: 'vat-billing-plan' } },
        })
        .mockResolvedValueOnce({
          data: { paymentWindowUrl: 'https://example.com/payment' },
        });
      await expect(
        createSubscriptionService({
          userId: 'creator',
          planId: 'plan',
          billingMonths: months,
        }),
      ).resolves.toMatchObject({ success: true });
      expect(mockEpayPost).toHaveBeenNthCalledWith(
        1,
        '/public/api/v1/subscriptions/billing/plans',
        expect.objectContaining({
          amount: gross,
          interval: { period: 'MONTH', frequency: months },
        }),
        expect.anything(),
      );
      expect(mockEpayPost).toHaveBeenNthCalledWith(
        2,
        '/public/api/v1/cit',
        expect.objectContaining({
          amount: gross,
          subscription: expect.objectContaining({
            amount: gross,
            billingAgreement: expect.objectContaining({
              billingPlanId: 'vat-billing-plan',
            }),
          }),
        }),
        expect.anything(),
      );
      expect(saveCheckout).toHaveBeenCalledWith(
        expect.objectContaining({
          amountMinor: gross,
          subtotalMinor: net * 100,
          vatMinor: gross - net * 100,
          vatRate: 25,
        }),
      );
    },
  );
});

describe('assigned custom offer protection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEpayPost.mockReset();
    jest.mocked(db.query.users.findFirst).mockResolvedValue({
      id: 'creator',
      email: 'creator@example.com',
      fullName: 'Creator',
    } as never);
  });

  it.each(['draft', 'pending', 'paid'])(
    'blocks a different free or paid plan while the custom offer is %s',
    async (status) => {
      for (const price of [0, 399]) {
        jest
          .mocked(db.select)
          .mockReturnValueOnce(
            rows([{ id: 'other', price, name: 'Other', currency: 'DKK' }]),
          )
          .mockReturnValueOnce(
            rows([
              {
                planId: 'custom-base',
                customPrice: 100,
                customSubscriptionStatus: status,
                customSubscriptionRevision: 2,
              },
            ]),
          );
        await expect(
          createSubscriptionService({ userId: 'creator', planId: 'other' }),
        ).rejects.toMatchObject({ status: 409 });
      }
      expect(db.update).not.toHaveBeenCalled();
      expect(db.insert).not.toHaveBeenCalled();
      expect(mockEpayPost).not.toHaveBeenCalled();
    },
  );

  it('keeps a pending offer unchanged after checkout failure and allows retry', async () => {
    const offer = {
      planId: 'custom-base',
      customPrice: 100,
      paymentPeriod: '1',
      customSubscriptionStatus: 'pending',
      customSubscriptionRevision: 2,
    };
    for (let attempt = 0; attempt < 2; attempt++) {
      jest
        .mocked(db.select)
        .mockReturnValueOnce(
          rows([
            {
              id: 'custom-base',
              price: 129,
              name: 'Start-up',
              currency: 'DKK',
            },
          ]),
        )
        .mockReturnValueOnce(rows([offer]));
    }
    mockEpayPost.mockRejectedValueOnce(new Error('Checkout unavailable'));
    await expect(
      createSubscriptionService({ userId: 'creator', planId: 'custom-base' }),
    ).rejects.toThrow('Failed to create subscription');
    const save = jest.fn().mockResolvedValue(undefined);
    jest.mocked(db.insert).mockReturnValue({ values: save } as never);
    mockEpayPost
      .mockResolvedValueOnce({ data: { billingPlan: { id: 'retry-billing' } } })
      .mockResolvedValueOnce({
        data: { paymentWindowUrl: 'https://example.com/retry' },
      });
    await expect(
      createSubscriptionService({ userId: 'creator', planId: 'custom-base' }),
    ).resolves.toMatchObject({
      success: true,
      data: { paymentWindowUrl: 'https://example.com/retry' },
    });
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({ customRevision: 2, amountMinor: 12500 }),
    );
    expect(db.update).not.toHaveBeenCalled();
    expect(offer.customSubscriptionStatus).toBe('pending');
  });
});
